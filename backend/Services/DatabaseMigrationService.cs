
using System.Security.Cryptography;
using MySqlConnector;

namespace VehicleAuction.Api.Services;

public sealed class DatabaseMigrationService
{
    private readonly string _connectionString;
    private readonly string _migrationsPath;

    public DatabaseMigrationService(
        IConfiguration configuration,
        IWebHostEnvironment environment)
    {
        _connectionString =
            configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "DefaultConnection is not configured.");

        _migrationsPath = Path.GetFullPath(
            Path.Combine(
                environment.ContentRootPath,
                "..",
                "database",
                "migrations"));
    }

    // Check SQL migration files without connecting to MySQL
    public void CheckMigrationFiles()
    {
        Console.WriteLine("=== Migration File Detection ===");
        Console.WriteLine($"Migration folder: {_migrationsPath}");

        if (!Directory.Exists(_migrationsPath))
        {
            Console.WriteLine("[ERROR] Migration folder not found.");
            return;
        }

        var files = Directory
            .GetFiles(_migrationsPath, "*.sql")
            .OrderBy(Path.GetFileName, StringComparer.Ordinal)
            .ToList();

        if (files.Count == 0)
        {
            Console.WriteLine("[INFO] No migration SQL files found.");
            return;
        }

        Console.WriteLine($"Total migration files: {files.Count}");

        foreach (var file in files)
        {
            Console.WriteLine($"[FOUND] {Path.GetFileName(file)}");
        }

        Console.WriteLine("=== File Detection Completed ===");
    }

    // Apply pending migrations to MySQL
    public async Task ApplyMigrationsAsync()
    {
        if (!Directory.Exists(_migrationsPath))
        {
            throw new DirectoryNotFoundException(
                $"Migration folder not found: {_migrationsPath}");
        }

        await using var connection =
            new MySqlConnection(_connectionString);

        await connection.OpenAsync();

        const string trackingSql = """
            CREATE TABLE IF NOT EXISTS schema_migrations (
                migration_id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                checksum CHAR(64) NOT NULL,
                applied_at TIMESTAMP NOT NULL
                    DEFAULT CURRENT_TIMESTAMP
            );
            """;

        await using (var command =
            new MySqlCommand(trackingSql, connection))
        {
            await command.ExecuteNonQueryAsync();
        }

        var migrationFiles = Directory
            .GetFiles(_migrationsPath, "*.sql")
            .OrderBy(Path.GetFileName, StringComparer.Ordinal)
            .ToList();

        foreach (var file in migrationFiles)
        {
            var filename = Path.GetFileName(file);
            var sql = await File.ReadAllTextAsync(file);

            var checksum = Convert.ToHexString(
                SHA256.HashData(
                    await File.ReadAllBytesAsync(file)));

            const string checkSql = """
                SELECT checksum
                FROM schema_migrations
                WHERE filename = @filename;
                """;

            string? existingChecksum;

            await using (var checkCommand =
                new MySqlCommand(checkSql, connection))
            {
                checkCommand.Parameters.AddWithValue(
                    "@filename", filename);

                existingChecksum =
                    (string?)await checkCommand.ExecuteScalarAsync();
            }

            if (existingChecksum != null)
            {
                if (!string.Equals(
                    existingChecksum,
                    checksum,
                    StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidOperationException(
                        $"Previously applied migration changed: {filename}");
                }

                Console.WriteLine($"[SKIP] {filename}");
                continue;
            }

            Console.WriteLine($"[APPLY] {filename}");

            try
            {
                await using var migrationCommand =
                    new MySqlCommand(sql, connection);

                await migrationCommand.ExecuteNonQueryAsync();

                const string insertSql = """
                    INSERT INTO schema_migrations
                        (filename, checksum)
                    VALUES (@filename, @checksum);
                    """;

                await using var insertCommand =
                    new MySqlCommand(insertSql, connection);

                insertCommand.Parameters.AddWithValue(
                    "@filename", filename);

                insertCommand.Parameters.AddWithValue(
                    "@checksum", checksum);

                await insertCommand.ExecuteNonQueryAsync();

                Console.WriteLine($"[DONE] {filename}");
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    $"Migration failed: {filename}. " +
                    "Check the database before retrying, " +
                    "because MySQL DDL may not roll back.",
                    ex);
            }
        }

        Console.WriteLine("Database migrations completed.");
    }
}
