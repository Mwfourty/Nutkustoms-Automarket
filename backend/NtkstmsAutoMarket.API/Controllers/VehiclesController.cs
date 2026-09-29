using Microsoft.AspNetCore.Mvc;
using NtkstmsAutoMarket.Application.Features.Vehicles.CreateVehicle;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly CreateVehicleHandler _handler;

    public VehiclesController(CreateVehicleHandler handler)
    {
        _handler = handler;
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        CreateVehicleCommand command,
        CancellationToken cancellationToken)
    {
        var vehicleId = await _handler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/vehicles/{vehicleId}",
            new { vehicleId });
    }
}