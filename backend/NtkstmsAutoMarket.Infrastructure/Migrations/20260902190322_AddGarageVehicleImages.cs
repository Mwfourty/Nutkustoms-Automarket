using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGarageVehicleImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "garage_vehicle_images",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GarageVehicleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPrimary = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_garage_vehicle_images", x => x.Id);
                    table.ForeignKey(
                        name: "FK_garage_vehicle_images_garage_vehicles_GarageVehicleId",
                        column: x => x.GarageVehicleId,
                        principalTable: "garage_vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_garage_vehicle_images_GarageVehicleId",
                table: "garage_vehicle_images",
                column: "GarageVehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_garage_vehicle_images_GarageVehicleId_DisplayOrder",
                table: "garage_vehicle_images",
                columns: new[] { "GarageVehicleId", "DisplayOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "garage_vehicle_images");
        }
    }
}
