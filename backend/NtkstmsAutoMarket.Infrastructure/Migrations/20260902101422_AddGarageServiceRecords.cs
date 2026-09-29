using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGarageServiceRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "garage_service_records",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    GarageVehicleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    ServiceDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Mileage = table.Column<int>(type: "integer", nullable: false),
                    ServiceProvider = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Cost = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_garage_service_records", x => x.Id);
                    table.ForeignKey(
                        name: "FK_garage_service_records_garage_vehicles_GarageVehicleId",
                        column: x => x.GarageVehicleId,
                        principalTable: "garage_vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_garage_service_records_GarageVehicleId",
                table: "garage_service_records",
                column: "GarageVehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_garage_service_records_GarageVehicleId_ServiceDate",
                table: "garage_service_records",
                columns: new[] { "GarageVehicleId", "ServiceDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "garage_service_records");
        }
    }
}
