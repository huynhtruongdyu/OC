using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using OC.Bootstrapper.Domain.Entities;

namespace OC.Bootstrapper.Infrastructure.Persistence.EntityConfigurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category> {
    public void Configure(EntityTypeBuilder<Category> builder) {
        builder.ToTable("Categories");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .HasMaxLength(1000);

        builder.HasIndex(e => e.Name).IsUnique();
    }
}
