using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NtkstmsAutoMarket.Application.Features.SellerReviews.CreateSellerReview;
using NtkstmsAutoMarket.Application.Features.SellerReviews.DeleteSellerReview;
using NtkstmsAutoMarket.Application.Features.SellerReviews.GetSellerReviews;
using NtkstmsAutoMarket.Application.Features.SellerReviews.UpdateSellerReview;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api/Users/{sellerId:guid}/reviews")]
public class SellerReviewsController : ControllerBase
{
    private readonly CreateSellerReviewHandler _createSellerReviewHandler;
    private readonly GetSellerReviewsHandler _getSellerReviewsHandler;
    private readonly UpdateSellerReviewHandler _updateSellerReviewHandler;
    private readonly DeleteSellerReviewHandler _deleteSellerReviewHandler;

    public SellerReviewsController(
        CreateSellerReviewHandler createSellerReviewHandler,
        GetSellerReviewsHandler getSellerReviewsHandler,
        UpdateSellerReviewHandler updateSellerReviewHandler,
        DeleteSellerReviewHandler deleteSellerReviewHandler)
    {
        _createSellerReviewHandler = createSellerReviewHandler;
        _getSellerReviewsHandler = getSellerReviewsHandler;
        _updateSellerReviewHandler = updateSellerReviewHandler;
        _deleteSellerReviewHandler = deleteSellerReviewHandler;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(
        Guid sellerId,
        CreateSellerReviewCommand command,
        CancellationToken cancellationToken)
    {
        var commandWithSeller = command with
        {
            SellerId = sellerId
        };

        var result = await _createSellerReviewHandler.Handle(
            commandWithSeller,
            cancellationToken);

        return Created(
            $"/api/Users/{sellerId}/reviews/{result.ReviewId}",
            result);
    }

    [Authorize]
    [HttpPut("{reviewId:guid}")]
    public async Task<IActionResult> Update(
        Guid sellerId,
        Guid reviewId,
        UpdateSellerReviewRequest request,
        CancellationToken cancellationToken)
    {
        var command = new UpdateSellerReviewCommand(
            reviewId,
            sellerId,
            request.Rating,
            request.Comment);

        var result = await _updateSellerReviewHandler.Handle(
            command,
            cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{reviewId:guid}")]
    public async Task<IActionResult> Delete(
        Guid sellerId,
        Guid reviewId,
        CancellationToken cancellationToken)
    {
        await _deleteSellerReviewHandler.Handle(
            new DeleteSellerReviewCommand(
                sellerId,
                reviewId),
            cancellationToken);

        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetReviews(
        Guid sellerId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var result = await _getSellerReviewsHandler.Handle(
            new GetSellerReviewsQuery(
                sellerId,
                page,
                pageSize),
            cancellationToken);

        return Ok(result);
    }
}
