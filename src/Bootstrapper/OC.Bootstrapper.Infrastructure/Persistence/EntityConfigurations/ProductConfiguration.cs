using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using OC.Bootstrapper.Domain.Entities;

namespace OC.Bootstrapper.Infrastructure.Persistence.EntityConfigurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product> {
    public void Configure(EntityTypeBuilder<Product> builder) {
        builder.ToTable("Products");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .HasMaxLength(2000);

        builder.Property(e => e.Price)
            .HasColumnType("decimal(18,2)");

        builder.HasOne(e => e.Category)
            .WithMany(e => e.Products)
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
