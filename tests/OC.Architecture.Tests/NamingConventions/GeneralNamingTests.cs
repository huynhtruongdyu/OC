namespace OC.Architecture.Tests.NamingConventions;

public sealed class GeneralNamingTests {
    private static readonly Assembly ApiAssembly = OC.Bootstrapper.API.AssemblyReference.Assembly;

    [Fact]
    public void Namespace_Should_MatchProjectName() {
        var types = Types.InAssembly(ApiAssembly).GetTypes();

        var violations = types
            .Where(t => !t.Namespace?.StartsWith("OC.Bootstrapper.API", StringComparison.Ordinal) == true)
            .ToList();

        violations.Should().BeEmpty("all types should be under OC.Bootstrapper.API namespace");
    }

    [Fact]
    public void InternalClasses_Should_BeSealed() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .AreNotAbstract()
            .And()
            .AreNotStatic()
            .And()
            .AreNotPublic()
            .Should()
            .BeSealed()
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void PublicTypes_Should_NotExistInInternalFolders() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Filters")
            .Or()
            .ResideInNamespace("OC.Bootstrapper.API.Extensions")
            .Or()
            .ResideInNamespace("OC.Bootstrapper.API.Transformers")
            .Should()
            .NotBePublic()
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }
}
