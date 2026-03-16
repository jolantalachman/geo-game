using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace geo_game.Migrations
{
    /// <inheritdoc />
    public partial class AddUserNick : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Nick",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nick",
                table: "Users");
        }
    }
}
