using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OC.Bootstrapper.API.Controllers.Base;

[ApiController]
[AllowAnonymous]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/public/[controller]/[action]")]
public abstract class PublicController : ControllerBase {
}
