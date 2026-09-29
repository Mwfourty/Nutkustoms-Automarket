using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class LinkListingsToGarageVehicles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SourceGarageVehicleId",
                table: "listings",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_listings_SourceGarageVehicleId",
                table: "listings",
                column: "SourceGarageVehicleId");

            migrationBuilder.AddForeignKey(
                name: "FK_listings_garage_vehicles_SourceGarageVehicleId",
                table: "listings",
                column: "SourceGarageVehicleId",
                principalTable: "garage_vehicles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_listings_garage_vehicles_SourceGarageVehicleId",
                table: "listings");

            migrationBuilder.DropIndex(
                name: "IX_listings_SourceGarageVehicleId",
                table: "listings");

            migrationBuilder.DropColumn(
                name: "SourceGarageVehicleId",
                table: "listings");
        }
    }
}
