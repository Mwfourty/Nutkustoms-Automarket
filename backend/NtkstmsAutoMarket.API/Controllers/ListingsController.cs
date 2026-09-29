using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NtkstmsAutoMarket.Application.Features.Listings.CreateListing;
using NtkstmsAutoMarket.Application.Features.Listings.GetListings;
using NtkstmsAutoMarket.Application.Features.Listings.GetMyListings;
using NtkstmsAutoMarket.Application.Features.Listings.GetListingById;
using NtkstmsAutoMarket.Application.Features.Listings.UpdateListing;
using NtkstmsAutoMarket.Application.Features.Listings.RemoveListing;
using NtkstmsAutoMarket.Application.Features.Listings.AddListingImage;
using NtkstmsAutoMarket.Application.Features.Listings.GetListingImages;
using NtkstmsAutoMarket.Application.Features.Listings.DeleteListingImage;
using NtkstmsAutoMarket.Application.Features.Listings.SetPrimaryListingImage;
using NtkstmsAutoMarket.Application.Features.Listings.Documents.AddListingDocument;
using NtkstmsAutoMarket.Application.Features.Listings.Documents.GetListingDocuments;
using NtkstmsAutoMarket.Application.Features.Listings.Documents.UpdateListingDocument;
using NtkstmsAutoMarket.Application.Features.Listings.Documents.DeleteListingDocument;
using NtkstmsAutoMarket.Application.Features.Listings.PublishListing;
using NtkstmsAutoMarket.Application.Features.Listings.ReserveListing;
using NtkstmsAutoMarket.Application.Features.Listings.MarkListingAsSold;
using NtkstmsAutoMarket.Domain.Enums;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingsController : ControllerBase
{
    private readonly CreateListingHandler _createListingHandler;
    private readonly GetListingsHandler _getListingsHandler;
    private readonly GetMyListingsHandler _getMyListingsHandler;
    private readonly GetListingByIdHandler _getListingByIdHandler;
    private readonly UpdateListingHandler _updateListingHandler;
    private readonly RemoveListingHandler _removeListingHandler;
    private readonly AddListingImageHandler _addListingImageHandler;
    private readonly GetListingImagesHandler _getListingImagesHandler;
    private readonly DeleteListingImageHandler _deleteListingImageHandler;
    private readonly SetPrimaryListingImageHandler _setPrimaryListingImageHandler;
    private readonly AddListingDocumentHandler _addListingDocumentHandler;
    private readonly GetListingDocumentsHandler _getListingDocumentsHandler;
    private readonly UpdateListingDocumentHandler _updateListingDocumentHandler;
    private readonly DeleteListingDocumentHandler _deleteListingDocumentHandler;
    private readonly PublishListingHandler _publishListingHandler;
    private readonly ReserveListingHandler _reserveListingHandler;
    private readonly MarkListingAsSoldHandler _markListingAsSoldHandler;


    public ListingsController(
    CreateListingHandler createListingHandler,
    GetListingsHandler getListingsHandler,
    GetMyListingsHandler getMyListingsHandler,
    GetListingByIdHandler getListingByIdHandler,
    UpdateListingHandler updateListingHandler,
    RemoveListingHandler removeListingHandler,
    AddListingImageHandler addListingImageHandler,
    GetListingImagesHandler getListingImagesHandler,
    DeleteListingImageHandler deleteListingImageHandler,
    SetPrimaryListingImageHandler setPrimaryListingImageHandler,
    AddListingDocumentHandler addListingDocumentHandler,
    GetListingDocumentsHandler getListingDocumentsHandler,
    UpdateListingDocumentHandler updateListingDocumentHandler,
    DeleteListingDocumentHandler deleteListingDocumentHandler,
    PublishListingHandler publishListingHandler,
    ReserveListingHandler reserveListingHandler,
    MarkListingAsSoldHandler markListingAsSoldHandler)
    {
        _createListingHandler = createListingHandler;
        _getListingsHandler = getListingsHandler;
        _getMyListingsHandler = getMyListingsHandler;
        _getListingByIdHandler = getListingByIdHandler;
        _updateListingHandler = updateListingHandler;
        _removeListingHandler = removeListingHandler;
        _addListingImageHandler = addListingImageHandler;
        _getListingImagesHandler = getListingImagesHandler;
        _deleteListingImageHandler = deleteListingImageHandler;
        _setPrimaryListingImageHandler = setPrimaryListingImageHandler;
        _addListingDocumentHandler = addListingDocumentHandler;
        _getListingDocumentsHandler = getListingDocumentsHandler;
        _updateListingDocumentHandler = updateListingDocumentHandler;
        _deleteListingDocumentHandler = deleteListingDocumentHandler;
        _publishListingHandler = publishListingHandler;
        _reserveListingHandler = reserveListingHandler;
        _markListingAsSoldHandler = markListingAsSoldHandler;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateListingCommand command,
        CancellationToken cancellationToken)
    {
        var result = await _createListingHandler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/listings/{result.ListingId}",
            result);
    }

    [HttpGet]
    public async Task<IActionResult> GetListings(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    [FromQuery] string? search = null,
    [FromQuery] ListingType? type = null,
    [FromQuery] ListingCondition? condition = null,
    [FromQuery] decimal? minPrice = null,
    [FromQuery] decimal? maxPrice = null,
    [FromQuery] string? location = null,
    [FromQuery] string? sortBy = null,
    [FromQuery] string? sortDirection = null,
    CancellationToken cancellationToken = default)
    {
        var result = await _getListingsHandler.Handle(
            new GetListingsQuery(
                page,
                pageSize,
                search,
                type,
                condition,
                minPrice,
                maxPrice,
                location,
                sortBy,
                sortDirection),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMyListings(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] ListingStatus? status = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _getMyListingsHandler.Handle(
            new GetMyListingsQuery(
                page,
                pageSize,
                status),
            cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
    Guid id,
    CancellationToken cancellationToken)
    {
        var result = await _getListingByIdHandler.Handle(
            new GetListingByIdQuery(id),
            cancellationToken);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
    Guid id,
    UpdateListingCommand command,
    CancellationToken cancellationToken)
    {
        if (id != command.ListingId)
            return BadRequest("Listing ID in URL does not match request body.");

        var result = await _updateListingHandler.Handle(
            command,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Remove(
    Guid id,
    CancellationToken cancellationToken)
    {
        var result = await _removeListingHandler.Handle(
            new RemoveListingCommand(id),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id:guid}/images")]
    public async Task<IActionResult> AddImage(
    Guid id,
    AddListingImageCommand command,
    CancellationToken cancellationToken)
    {
        if (id != command.ListingId)
            return BadRequest("Listing ID mismatch.");

        var result = await _addListingImageHandler.Handle(
            command,
            cancellationToken);

        return Created(
            $"/api/listings/{id}/images/{result.ListingImageId}",
            result);
    }

    [HttpGet("{id:guid}/images")]
    public async Task<IActionResult> GetImages(
    Guid id,
    CancellationToken cancellationToken)
    {
        var result = await _getListingImagesHandler.Handle(
            new GetListingImagesQuery(id),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}/images/{imageId:guid}")]
    public async Task<IActionResult> DeleteImage(
    Guid id,
    Guid imageId,
    CancellationToken cancellationToken)
    {
        var result = await _deleteListingImageHandler.Handle(
            new DeleteListingImageCommand(id, imageId),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("{id:guid}/images/{imageId:guid}/primary")]
    public async Task<IActionResult> SetPrimaryImage(
    Guid id,
    Guid imageId,
    CancellationToken cancellationToken)
    {
        var result = await _setPrimaryListingImageHandler.Handle(
            new SetPrimaryListingImageCommand(id, imageId),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id:guid}/documents")]
    public async Task<IActionResult> AddDocument(
    Guid id,
    AddListingDocumentCommand command,
    CancellationToken cancellationToken)
    {
        var commandWithListingId = command with
        {
            ListingId = id
        };

        var result = await _addListingDocumentHandler.Handle(
            commandWithListingId,
            cancellationToken);

        return Created(
            $"/api/listings/{id}/documents/{result.DocumentId}",
            result);
    }

    [HttpGet("{id:guid}/documents")]
    public async Task<IActionResult> GetDocuments(
    Guid id,
    CancellationToken cancellationToken)
    {
        var result = await _getListingDocumentsHandler.Handle(
            new GetListingDocumentsQuery(id),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("{id:guid}/documents/{documentId:guid}")]
    public async Task<IActionResult> UpdateDocument(
    Guid id,
    Guid documentId,
    UpdateListingDocumentCommand command,
    CancellationToken cancellationToken)
    {
        var commandWithIds = command with
        {
            ListingId = id,
            DocumentId = documentId
        };

        var result = await _updateListingDocumentHandler.Handle(
            commandWithIds,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{id:guid}/documents/{documentId:guid}")]
    public async Task<IActionResult> DeleteDocument(
    Guid id,
    Guid documentId,
    CancellationToken cancellationToken)
    {
        var result = await _deleteListingDocumentHandler.Handle(
            new DeleteListingDocumentCommand(id, documentId),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [Authorize]
    [HttpPut("{id:guid}/publish")]
    public async Task<IActionResult> Publish(
    Guid id,
    CancellationToken cancellationToken)
    {
        var result = await _publishListingHandler.Handle(
            new PublishListingCommand(id),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("{id:guid}/reserve")]
    public async Task<IActionResult> Reserve(
    Guid id,
    CancellationToken cancellationToken)
    {
        var result = await _reserveListingHandler.Handle(
            new ReserveListingCommand(id),
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("{id:guid}/sold")]
    public async Task<IActionResult> MarkAsSold(
    Guid id,
    CancellationToken cancellationToken)
    {
        var result = await _markListingAsSoldHandler.Handle(
            new MarkListingAsSoldCommand(id),
            cancellationToken);

        return Ok(result);
    }
}