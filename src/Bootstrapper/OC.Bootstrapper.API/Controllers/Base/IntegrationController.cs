using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OC.Bootstrapper.API.Controllers.Base;

[ApiController]
[Authorize]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/integration/[controller]/[action]")]
public abstract class IntegrationController : ControllerBase {
}
