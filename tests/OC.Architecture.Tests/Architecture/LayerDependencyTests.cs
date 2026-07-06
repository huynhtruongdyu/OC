namespace OC.Architecture.Tests.Architecture;

public sealed class LayerDependencyTests {
    private static readonly Assembly DomainAssembly = OC.Bootstrapper.Domain.AssemblyReference.Assembly;
    private static readonly Assembly ApplicationAssembly = OC.Bootstrapper.Application.AssemblyReference.Assembly;
    private static readonly Assembly InfrastructureAssembly = OC.Bootstrapper.Infrastructure.AssemblyReference.Assembly;
    private static readonly Assembly SharedAssembly = OC.Bootstrapper.Shared.AssemblyReference.Assembly;
    private static readonly Assembly SharedKernelAssembly = OC.BuildingBlocks.SharedKernel.AssemblyReference.Assembly;

    [Fact]
    public void Domain_Should_NotDependOnApplication() {
        var result = Types.InAssembly(DomainAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.Domain")
            .ShouldNot()
            .HaveDependencyOn("OC.Bootstrapper.Application")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Domain_Should_NotDependOnInfrastructure() {
        var result = Types.InAssembly(DomainAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.Domain")
            .ShouldNot()
            .HaveDependencyOn("OC.Bootstrapper.Infrastructure")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Domain_Should_NotDependOnApi() {
        var result = Types.InAssembly(DomainAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.Domain")
            .ShouldNot()
            .HaveDependencyOn("OC.Bootstrapper.API")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Application_Should_NotDependOnInfrastructure() {
        var result = Types.InAssembly(ApplicationAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.Application")
            .ShouldNot()
            .HaveDependencyOn("OC.Bootstrapper.Infrastructure")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Application_Should_NotDependOnApi() {
        var result = Types.InAssembly(ApplicationAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.Application")
            .ShouldNot()
            .HaveDependencyOn("OC.Bootstrapper.API")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Infrastructure_Should_NotDependOnApi() {
        var result = Types.InAssembly(InfrastructureAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.Infrastructure")
            .ShouldNot()
            .HaveDependencyOn("OC.Bootstrapper.API")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Shared_Should_NotDependOnAnyBootstrapperProject() {
        var result = Types.InAssembly(SharedAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.Shared")
            .ShouldNot()
            .HaveDependencyOn("OC.Bootstrapper.Application")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void SharedKernel_Should_NotDependOnAnyProject() {
        var result = Types.InAssembly(SharedKernelAssembly)
            .That()
            .ResideInNamespace("OC.BuildingBlocks.SharedKernel")
            .ShouldNot()
            .HaveDependencyOn("OC.Bootstrapper")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }
}
