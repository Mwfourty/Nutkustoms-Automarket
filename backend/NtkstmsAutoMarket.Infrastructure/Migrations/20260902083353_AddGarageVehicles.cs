using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGarageVehicles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "garage_vehicles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Make = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Model = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    Mileage = table.Column<int>(type: "integer", nullable: false),
                    EngineDetails = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Transmission = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Kilowatts = table.Column<int>(type: "integer", nullable: true),
                    Drivetrain = table.Column<int>(type: "integer", nullable: true),
                    FuelType = table.Column<int>(type: "integer", nullable: true),
                    BodyType = table.Column<int>(type: "integer", nullable: true),
                    Color = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Vin = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    IsPublic = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_garage_vehicles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_garage_vehicles_users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_garage_vehicles_OwnerId",
                table: "garage_vehicles",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_garage_vehicles_OwnerId_IsPublic",
                table: "garage_vehicles",
                columns: new[] { "OwnerId", "IsPublic" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "garage_vehicles");
        }
    }
}
