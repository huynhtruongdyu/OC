namespace OC.Architecture.Tests.NamingConventions;

public sealed class LayerNamingTests {
    private static readonly Assembly ApiAssembly = OC.Bootstrapper.API.AssemblyReference.Assembly;

    [Fact]
    public void Filters_Should_EndWithFilter() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Filters")
            .Should()
            .HaveNameEndingWith("Filter")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Extensions_Should_EndWithExtensions() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Extensions")
            .Should()
            .HaveNameEndingWith("Extensions")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Transformers_Should_EndWithTransformer() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Transformers")
            .Should()
            .HaveNameEndingWith("Transformer")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Extensions_Should_BeStatic() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Extensions")
            .Should()
            .BeStatic()
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }
}
