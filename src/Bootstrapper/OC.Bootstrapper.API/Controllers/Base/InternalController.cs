using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace OC.Bootstrapper.API.Controllers.Base;

[ApiController]
[Authorize]
[ApiVersion("1.0")]
public abstract class InternalController : ControllerBase {
}
