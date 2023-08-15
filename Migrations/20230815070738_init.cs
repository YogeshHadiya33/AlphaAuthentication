using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AlphaAuthentication.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Authentication",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BPOId = table.Column<int>(type: "int", nullable: false),
                    LeadId = table.Column<long>(type: "bigint", nullable: false),
                    FirstName = table.Column<string>(type: "varchar(100)", nullable: false),
                    LastName = table.Column<string>(type: "varchar(100)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "date", nullable: false),
                    MobileNumber = table.Column<string>(type: "varchar(20)", nullable: true),
                    EmailAddress = table.Column<string>(type: "varchar(250)", nullable: true),
                    SourceUrl = table.Column<string>(type: "varchar(500)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Authentication_Id", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Authentication");
        }
    }
}
