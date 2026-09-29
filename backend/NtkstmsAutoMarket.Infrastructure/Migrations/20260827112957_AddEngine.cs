using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEngine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Condition",
                table: "parts",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Manufacturer",
                table: "engines",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.Sql("""
                ALTER TABLE engines
                ALTER COLUMN "FuelType" TYPE integer
                USING CASE
                    WHEN "FuelType" IS NULL OR btrim("FuelType") = '' THEN 0
                    WHEN lower(btrim("FuelType")) = 'petrol' THEN 1
                    WHEN lower(btrim("FuelType")) = 'diesel' THEN 2
                    WHEN lower(btrim("FuelType")) = 'hybrid' THEN 3
                    WHEN lower(btrim("FuelType")) = 'electric' THEN 4
                    WHEN btrim("FuelType") ~ '^[0-9]+$' THEN btrim("FuelType")::integer
                    ELSE 0
                END;

                ALTER TABLE engines
                ALTER COLUMN "FuelType" SET NOT NULL;

                ALTER TABLE engines
                ALTER COLUMN "FuelType" SET DEFAULT 0;
            """);

            migrationBuilder.AlterColumn<string>(
                name: "EngineCode",
                table: "engines",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.Sql("""
                ALTER TABLE engines
                ALTER COLUMN "Displacement" TYPE numeric(4,1)
                USING NULLIF("Displacement", '')::numeric;
            """);

            migrationBuilder.AddColumn<string>(
                name: "CompatibleMake",
                table: "engines",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompatibleModel",
                table: "engines",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompatibleYearFrom",
                table: "engines",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompatibleYearTo",
                table: "engines",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Model",
                table: "engines",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompatibleMake",
                table: "engines");

            migrationBuilder.DropColumn(
                name: "CompatibleModel",
                table: "engines");

            migrationBuilder.DropColumn(
                name: "CompatibleYearFrom",
                table: "engines");

            migrationBuilder.DropColumn(
                name: "CompatibleYearTo",
                table: "engines");

            migrationBuilder.DropColumn(
                name: "Model",
                table: "engines");

            migrationBuilder.AlterColumn<string>(
                name: "Condition",
                table: "parts",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Manufacturer",
                table: "engines",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.Sql("""
                ALTER TABLE engines
                ALTER COLUMN "FuelType" TYPE integer
                USING 0;
            """);

            migrationBuilder.Sql("""
                UPDATE engines
                SET "FuelType" = 0
                WHERE "FuelType" IS NULL;
            """);

            migrationBuilder.Sql("""
                ALTER TABLE engines
                ALTER COLUMN "FuelType" SET NOT NULL;
            """);

            migrationBuilder.Sql("""
                ALTER TABLE engines
                ALTER COLUMN "FuelType" SET DEFAULT 0;
            """);

            migrationBuilder.AlterColumn<string>(
                name: "EngineCode",
                table: "engines",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Displacement",
                table: "engines",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "numeric(4,1)",
                oldPrecision: 4,
                oldScale: 1,
                oldNullable: true);
        }
    }
}
