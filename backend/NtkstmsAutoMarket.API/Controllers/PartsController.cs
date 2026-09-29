using Microsoft.AspNetCore.Mvc;
using NtkstmsAutoMarket.Application.Features.Parts.CreatePart;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartsController : ControllerBase
{
    private readonly CreatePartHandler _createPartHandler;

    public PartsController(
        CreatePartHandler createPartHandler)
    {
        _createPartHandler = createPartHandler;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreatePartCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _createPartHandler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/parts/{result.PartId}",
            result);
    }
}