using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGarageVehicleLikes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "garage_vehicle_likes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    GarageVehicleId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_garage_vehicle_likes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_garage_vehicle_likes_garage_vehicles_GarageVehicleId",
                        column: x => x.GarageVehicleId,
                        principalTable: "garage_vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_garage_vehicle_likes_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_garage_vehicle_likes_GarageVehicleId",
                table: "garage_vehicle_likes",
                column: "GarageVehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_garage_vehicle_likes_UserId_GarageVehicleId",
                table: "garage_vehicle_likes",
                columns: new[] { "UserId", "GarageVehicleId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "garage_vehicle_likes");
        }
    }
}
