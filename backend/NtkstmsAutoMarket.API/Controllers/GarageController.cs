using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NtkstmsAutoMarket.Application.Features.Garage.CreateGarageVehicle;
using NtkstmsAutoMarket.Application.Features.Garage.DeleteGarageVehicle;
using NtkstmsAutoMarket.Application.Features.Garage.GetGarageVehicle;
using NtkstmsAutoMarket.Application.Features.Garage.GetMyGarage;
using NtkstmsAutoMarket.Application.Features.Garage.GetPublicGarage;
using NtkstmsAutoMarket.Application.Features.Garage.GetUserGarage;
using NtkstmsAutoMarket.Application.Features.Garage.Images.AddGarageVehicleImage;
using NtkstmsAutoMarket.Application.Features.Garage.Images.DeleteGarageVehicleImage;
using NtkstmsAutoMarket.Application.Features.Garage.Images.GetGarageVehicleImages;
using NtkstmsAutoMarket.Application.Features.Garage.Images.SetPrimaryGarageVehicleImage;
using NtkstmsAutoMarket.Application.Features.Garage.Modifications.CreateModification;
using NtkstmsAutoMarket.Application.Features.Garage.Modifications.DeleteModification;
using NtkstmsAutoMarket.Application.Features.Garage.Modifications.GetModifications;
using NtkstmsAutoMarket.Application.Features.Garage.Modifications.UpdateModification;
using NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.CreateServiceRecord;
using NtkstmsAutoMarket.Application.Features.Garage.UpdateGarageVehicle;
using NtkstmsAutoMarket.Application.Features.Garage.UpdateGarageVehicleVisibility;
using NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.DeleteServiceRecord;
using NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.GetServiceRecords;
using NtkstmsAutoMarket.Application.Features.Garage.ServiceRecords.UpdateServiceRecord;
using NtkstmsAutoMarket.Application.Features.Garage.SellGarageVehicle;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GarageController : ControllerBase
{
    private readonly CreateGarageVehicleHandler _createGarageVehicleHandler;
    private readonly DeleteGarageVehicleHandler _deleteGarageVehicleHandler;
    private readonly AddGarageVehicleImageHandler
        _addGarageVehicleImageHandler;
    private readonly DeleteGarageVehicleImageHandler
        _deleteGarageVehicleImageHandler;
    private readonly GetGarageVehicleImagesHandler
        _getGarageVehicleImagesHandler;
    private readonly SetPrimaryGarageVehicleImageHandler
        _setPrimaryGarageVehicleImageHandler;
    private readonly UpdateGarageVehicleHandler _updateGarageVehicleHandler;
    private readonly UpdateGarageVehicleVisibilityHandler
        _updateGarageVehicleVisibilityHandler;
    private readonly GetMyGarageHandler _getMyGarageHandler;
    private readonly GetUserGarageHandler _getUserGarageHandler;
    private readonly GetGarageVehicleHandler _getGarageVehicleHandler;
    private readonly GetPublicGarageHandler _getPublicGarageHandler;
    private readonly CreateModificationHandler _createModificationHandler;
    private readonly DeleteModificationHandler _deleteModificationHandler;
    private readonly GetModificationsHandler _getModificationsHandler;
    private readonly UpdateModificationHandler _updateModificationHandler;
    private readonly CreateServiceRecordHandler _createServiceRecordHandler;
    private readonly DeleteServiceRecordHandler _deleteServiceRecordHandler;
    private readonly GetServiceRecordsHandler _getServiceRecordsHandler;
    private readonly UpdateServiceRecordHandler _updateServiceRecordHandler;
    private readonly SellGarageVehicleHandler
        _sellGarageVehicleHandler;

    public GarageController(
        CreateGarageVehicleHandler createGarageVehicleHandler,
        DeleteGarageVehicleHandler deleteGarageVehicleHandler,
        AddGarageVehicleImageHandler addGarageVehicleImageHandler,
        DeleteGarageVehicleImageHandler deleteGarageVehicleImageHandler,
        GetGarageVehicleImagesHandler getGarageVehicleImagesHandler,
        SetPrimaryGarageVehicleImageHandler
            setPrimaryGarageVehicleImageHandler,
        UpdateGarageVehicleHandler updateGarageVehicleHandler,
        UpdateGarageVehicleVisibilityHandler
            updateGarageVehicleVisibilityHandler,
        GetMyGarageHandler getMyGarageHandler,
        GetUserGarageHandler getUserGarageHandler,
        GetGarageVehicleHandler getGarageVehicleHandler,
        GetPublicGarageHandler getPublicGarageHandler,
        CreateModificationHandler createModificationHandler,
        DeleteModificationHandler deleteModificationHandler,
        GetModificationsHandler getModificationsHandler,
        UpdateModificationHandler updateModificationHandler,
        CreateServiceRecordHandler createServiceRecordHandler,
        DeleteServiceRecordHandler deleteServiceRecordHandler,
        GetServiceRecordsHandler getServiceRecordsHandler,
        UpdateServiceRecordHandler updateServiceRecordHandler,
        SellGarageVehicleHandler sellGarageVehicleHandler)
    {
        _createGarageVehicleHandler = createGarageVehicleHandler;
        _deleteGarageVehicleHandler = deleteGarageVehicleHandler;
        _addGarageVehicleImageHandler =
            addGarageVehicleImageHandler;
        _deleteGarageVehicleImageHandler =
            deleteGarageVehicleImageHandler;
        _getGarageVehicleImagesHandler =
            getGarageVehicleImagesHandler;
        _setPrimaryGarageVehicleImageHandler =
            setPrimaryGarageVehicleImageHandler;
        _updateGarageVehicleHandler = updateGarageVehicleHandler;
        _updateGarageVehicleVisibilityHandler =
            updateGarageVehicleVisibilityHandler;
        _getMyGarageHandler = getMyGarageHandler;
        _getUserGarageHandler = getUserGarageHandler;
        _getGarageVehicleHandler = getGarageVehicleHandler;
        _getPublicGarageHandler = getPublicGarageHandler;
        _createModificationHandler = createModificationHandler;
        _deleteModificationHandler = deleteModificationHandler;
        _getModificationsHandler = getModificationsHandler;
        _updateModificationHandler = updateModificationHandler;
        _createServiceRecordHandler = createServiceRecordHandler;
        _deleteServiceRecordHandler = deleteServiceRecordHandler;
        _getServiceRecordsHandler = getServiceRecordsHandler;
        _updateServiceRecordHandler = updateServiceRecordHandler;
        _sellGarageVehicleHandler = sellGarageVehicleHandler;
    }

    [Authorize]
    [HttpPost("vehicles")]
    public async Task<IActionResult> CreateVehicle(
        CreateGarageVehicleCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _createGarageVehicleHandler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/Garage/vehicles/{result.Id}",
            result);
    }

    [Authorize]
    [HttpPut("vehicles/{vehicleId:guid}")]
    public async Task<IActionResult> UpdateVehicle(
        Guid vehicleId,
        UpdateGarageVehicleRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateGarageVehicleCommand(
            vehicleId,
            request.Make,
            request.Model,
            request.Year,
            request.Mileage,
            request.EngineDetails,
            request.Transmission,
            request.Kilowatts,
            request.Drivetrain,
            request.FuelType,
            request.BodyType,
            request.Color,
            request.Vin);

        var result = await _updateGarageVehicleHandler.Handle(
            command,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("vehicles/{vehicleId:guid}")]
    public async Task<IActionResult> DeleteVehicle(
        Guid vehicleId,
        CancellationToken cancellationToken)
    {
        await _deleteGarageVehicleHandler.Handle(
            new DeleteGarageVehicleCommand(vehicleId),
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpPost("vehicles/{vehicleId:guid}/images")]
    public async Task<IActionResult> AddVehicleImage(
        Guid vehicleId,
        AddGarageVehicleImageRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _addGarageVehicleImageHandler.Handle(
            new AddGarageVehicleImageCommand(
                vehicleId,
                request.Url,
                request.IsPrimary),
            cancellationToken);

        return Created(
            $"/api/Garage/vehicles/{vehicleId}/images/{result.Id}",
            result);
    }

    [HttpGet("vehicles/{vehicleId:guid}/images")]
    public async Task<IActionResult> GetVehicleImages(
        Guid vehicleId,
        CancellationToken cancellationToken)
    {
        var result = await _getGarageVehicleImagesHandler.Handle(
            new GetGarageVehicleImagesQuery(vehicleId),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("vehicles/{vehicleId:guid}/images/{imageId:guid}")]
    public async Task<IActionResult> DeleteVehicleImage(
        Guid vehicleId,
        Guid imageId,
        CancellationToken cancellationToken)
    {
        await _deleteGarageVehicleImageHandler.Handle(
            new DeleteGarageVehicleImageCommand(
                vehicleId,
                imageId),
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpPut("vehicles/{vehicleId:guid}/images/{imageId:guid}/primary")]
    public async Task<IActionResult> SetPrimaryVehicleImage(
        Guid vehicleId,
        Guid imageId,
        CancellationToken cancellationToken)
    {
        var result =
            await _setPrimaryGarageVehicleImageHandler.Handle(
                new SetPrimaryGarageVehicleImageCommand(
                    vehicleId,
                    imageId),
                cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("vehicles/{vehicleId:guid}/visibility")]
    public async Task<IActionResult> UpdateVehicleVisibility(
        Guid vehicleId,
        UpdateGarageVehicleVisibilityRequest request,
        CancellationToken cancellationToken)
    {
        var result =
            await _updateGarageVehicleVisibilityHandler.Handle(
                new UpdateGarageVehicleVisibilityCommand(
                    vehicleId,
                    request.IsPublic),
                cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMyGarage(
        CancellationToken cancellationToken)
    {
        var result = await _getMyGarageHandler.Handle(
            new GetMyGarageQuery(),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("users/{userId:guid}")]
    public async Task<IActionResult> GetPublicGarage(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var result = await _getPublicGarageHandler.Handle(
            new GetPublicGarageQuery(userId),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("vehicles/{id:guid}")]
    public async Task<IActionResult> GetVehicle(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _getGarageVehicleHandler.Handle(
            new GetGarageVehicleQuery(id),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPost("vehicles/{vehicleId:guid}/modifications")]
    public async Task<IActionResult> CreateModification(
        Guid vehicleId,
        CreateModificationRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateModificationCommand(
            vehicleId,
            request.Name,
            request.Category,
            request.Brand,
            request.Description,
            request.InstalledDate,
            request.Cost);

        var result = await _createModificationHandler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/Garage/vehicles/{vehicleId}/modifications/{result.Id}",
            result);
    }

    [HttpGet("vehicles/{vehicleId:guid}/modifications")]
    public async Task<IActionResult> GetModifications(
        Guid vehicleId,
        CancellationToken cancellationToken)
    {
        var result = await _getModificationsHandler.Handle(
            new GetModificationsQuery(vehicleId),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("vehicles/{vehicleId:guid}/modifications/{modificationId:guid}")]
    public async Task<IActionResult> UpdateModification(
        Guid vehicleId,
        Guid modificationId,
        UpdateModificationRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateModificationCommand(
            vehicleId,
            modificationId,
            request.Name,
            request.Category,
            request.Brand,
            request.Description,
            request.InstalledDate,
            request.Cost);

        var result = await _updateModificationHandler.Handle(
            command,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("vehicles/{vehicleId:guid}/modifications/{modificationId:guid}")]
    public async Task<IActionResult> DeleteModification(
        Guid vehicleId,
        Guid modificationId,
        CancellationToken cancellationToken)
    {
        await _deleteModificationHandler.Handle(
            new DeleteModificationCommand(
                vehicleId,
                modificationId),
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpPost("vehicles/{vehicleId:guid}/service-records")]
    public async Task<IActionResult> CreateServiceRecord(
        Guid vehicleId,
        CreateServiceRecordRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateServiceRecordCommand(
            vehicleId,
            request.Title,
            request.Description,
            request.ServiceDate,
            request.Mileage,
            request.ServiceProvider,
            request.Cost);

        var result = await _createServiceRecordHandler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/Garage/vehicles/{vehicleId}/service-records/{result.Id}",
            result);
    }

    [HttpGet("vehicles/{vehicleId:guid}/service-records")]
    public async Task<IActionResult> GetServiceRecords(
        Guid vehicleId,
        CancellationToken cancellationToken)
    {
        var result = await _getServiceRecordsHandler.Handle(
            new GetServiceRecordsQuery(vehicleId),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("vehicles/{vehicleId:guid}/service-records/{recordId:guid}")]
    public async Task<IActionResult> UpdateServiceRecord(
        Guid vehicleId,
        Guid recordId,
        UpdateServiceRecordRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateServiceRecordCommand(
            vehicleId,
            recordId,
            request.Title,
            request.Description,
            request.ServiceDate,
            request.Mileage,
            request.ServiceProvider,
            request.Cost);

        var result = await _updateServiceRecordHandler.Handle(
            command,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("vehicles/{vehicleId:guid}/service-records/{recordId:guid}")]
    public async Task<IActionResult> DeleteServiceRecord(
        Guid vehicleId,
        Guid recordId,
        CancellationToken cancellationToken)
    {
        await _deleteServiceRecordHandler.Handle(
            new DeleteServiceRecordCommand(
                vehicleId,
                recordId),
            cancellationToken);

        return NoContent();
    }

    [Authorize]
    [HttpPost("vehicles/{vehicleId:guid}/sell")]
    public async Task<IActionResult> SellVehicle(
        Guid vehicleId,
        SellGarageVehicleRequest request,
        CancellationToken cancellationToken)
    {
        var command = new SellGarageVehicleCommand(
            vehicleId,
            request.Title,
            request.Description,
            request.Price,
            request.Condition,
            request.Location);

        var result = await _sellGarageVehicleHandler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/Listings/{result.ListingId}",
            result);
    }
}
