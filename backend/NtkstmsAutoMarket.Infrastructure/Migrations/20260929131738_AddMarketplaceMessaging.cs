using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NtkstmsAutoMarket.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMarketplaceMessaging : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "marketplace_conversations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ListingId = table.Column<Guid>(type: "uuid", nullable: false),
                    BuyerId = table.Column<Guid>(type: "uuid", nullable: false),
                    SellerId = table.Column<Guid>(type: "uuid", nullable: false),
                    LastMessageAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_marketplace_conversations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_marketplace_conversations_listings_ListingId",
                        column: x => x.ListingId,
                        principalTable: "listings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_marketplace_conversations_users_BuyerId",
                        column: x => x.BuyerId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_marketplace_conversations_users_SellerId",
                        column: x => x.SellerId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "marketplace_messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderId = table.Column<Guid>(type: "uuid", nullable: false),
                    Body = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_marketplace_messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_marketplace_messages_marketplace_conversations_Conversation~",
                        column: x => x.ConversationId,
                        principalTable: "marketplace_conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_marketplace_messages_users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_marketplace_conversations_BuyerId",
                table: "marketplace_conversations",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_marketplace_conversations_LastMessageAt",
                table: "marketplace_conversations",
                column: "LastMessageAt");

            migrationBuilder.CreateIndex(
                name: "IX_marketplace_conversations_ListingId_BuyerId",
                table: "marketplace_conversations",
                columns: new[] { "ListingId", "BuyerId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_marketplace_conversations_SellerId",
                table: "marketplace_conversations",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_marketplace_messages_ConversationId_CreatedAt",
                table: "marketplace_messages",
                columns: new[] { "ConversationId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_marketplace_messages_ConversationId_ReadAt",
                table: "marketplace_messages",
                columns: new[] { "ConversationId", "ReadAt" });

            migrationBuilder.CreateIndex(
                name: "IX_marketplace_messages_SenderId",
                table: "marketplace_messages",
                column: "SenderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "marketplace_messages");

            migrationBuilder.DropTable(
                name: "marketplace_conversations");
        }
    }
}
