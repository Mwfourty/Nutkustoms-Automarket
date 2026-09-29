using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWheel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Width",
                table: "wheels",
                type: "numeric(4,1)",
                precision: 4,
                scale: 1,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AlterColumn<decimal>(
                name: "Diameter",
                table: "wheels",
                type: "numeric(4,1)",
                precision: 4,
                scale: 1,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(5,2)",
                oldPrecision: 5,
                oldScale: 2);

            migrationBuilder.AddColumn<string>(
                name: "CompatibleMake",
                table: "wheels",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CompatibleModel",
                table: "wheels",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompatibleYearFrom",
                table: "wheels",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompatibleYearTo",
                table: "wheels",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "wheels",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompatibleMake",
                table: "wheels");

            migrationBuilder.DropColumn(
                name: "CompatibleModel",
                table: "wheels");

            migrationBuilder.DropColumn(
                name: "CompatibleYearFrom",
                table: "wheels");

            migrationBuilder.DropColumn(
                name: "CompatibleYearTo",
                table: "wheels");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "wheels");

            migrationBuilder.AlterColumn<decimal>(
                name: "Width",
                table: "wheels",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(4,1)",
                oldPrecision: 4,
                oldScale: 1);

            migrationBuilder.AlterColumn<decimal>(
                name: "Diameter",
                table: "wheels",
                type: "numeric(5,2)",
                precision: 5,
                scale: 2,
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(4,1)",
                oldPrecision: 4,
                oldScale: 1);
        }
    }
}
