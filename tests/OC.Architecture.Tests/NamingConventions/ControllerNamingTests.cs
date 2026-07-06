using Microsoft.AspNetCore.Mvc;

namespace OC.Architecture.Tests.NamingConventions;

public sealed class ControllerNamingTests {
    private static readonly Assembly ApiAssembly = OC.Bootstrapper.API.AssemblyReference.Assembly;

    [Fact]
    public void Controllers_Should_EndWithController() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Controllers")
            .And()
            .AreNotAbstract()
            .Should()
            .HaveNameEndingWith("Controller")
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void BaseControllers_Should_BeAbstract() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Controllers.Base")
            .Should()
            .BeAbstract()
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void NonAbstractControllers_Should_BeSealed() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Controllers")
            .And()
            .AreNotAbstract()
            .Should()
            .BeSealed()
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }

    [Fact]
    public void Controllers_Should_InheritFromControllerBase() {
        var result = Types.InAssembly(ApiAssembly)
            .That()
            .ResideInNamespace("OC.Bootstrapper.API.Controllers")
            .And()
            .AreNotAbstract()
            .Should()
            .Inherit(typeof(ControllerBase))
            .GetResult();

        result.IsSuccessful.Should().BeTrue();
    }
}
