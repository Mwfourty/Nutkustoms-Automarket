using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompatibleMakes",
                table: "parts");

            migrationBuilder.DropColumn(
                name: "CompatibleModels",
                table: "parts");

            migrationBuilder.RenameColumn(
                name: "Brand",
                table: "parts",
                newName: "Manufacturer");

            migrationBuilder.AlterColumn<int>(
                name: "FuelType",
                table: "vehicles",
                type: "integer",
                maxLength: 50,
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Drivetrain",
                table: "vehicles",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "BodyType",
                table: "vehicles",
                type: "integer",
                maxLength: 50,
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "parts",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompatibleMake",
                table: "parts",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompatibleModel",
                table: "parts",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompatibleYearFrom",
                table: "parts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompatibleYearTo",
                table: "parts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Condition",
                table: "parts",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompatibleMake",
                table: "parts");

            migrationBuilder.DropColumn(
                name: "CompatibleModel",
                table: "parts");

            migrationBuilder.DropColumn(
                name: "CompatibleYearFrom",
                table: "parts");

            migrationBuilder.DropColumn(
                name: "CompatibleYearTo",
                table: "parts");

            migrationBuilder.DropColumn(
                name: "Condition",
                table: "parts");

            migrationBuilder.RenameColumn(
                name: "Manufacturer",
                table: "parts",
                newName: "Brand");

            migrationBuilder.AlterColumn<string>(
                name: "FuelType",
                table: "vehicles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<int>(
                name: "Drivetrain",
                table: "vehicles",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "BodyType",
                table: "vehicles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "parts",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompatibleMakes",
                table: "parts",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompatibleModels",
                table: "parts",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);
        }
    }
}
