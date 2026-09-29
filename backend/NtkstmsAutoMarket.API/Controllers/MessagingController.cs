using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NtkstmsAutoMarket.Application.Features.Messaging.GetConversations;
using NtkstmsAutoMarket.Application.Features.Messaging.StartConversation;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api")]
public class MessagingController : ControllerBase
{
    private readonly StartConversationHandler
        _startConversationHandler;
    private readonly GetConversationsHandler
        _getConversationsHandler;

    public MessagingController(
        StartConversationHandler startConversationHandler,
        GetConversationsHandler getConversationsHandler)
    {
        _startConversationHandler =
            startConversationHandler;

        _getConversationsHandler =
            getConversationsHandler;
    }

    [Authorize]
    [HttpPost("Listings/{listingId:guid}/conversations")]
    public async Task<IActionResult> StartConversation(
        Guid listingId,
        StartConversationRequest request,
        CancellationToken cancellationToken)
    {
        var result =
            await _startConversationHandler.Handle(
                new StartConversationCommand(
                    listingId,
                    request.Message),
                cancellationToken);

        return Created(
            $"/api/Conversations/{result.ConversationId}",
            result);
    }

    [Authorize]
    [HttpGet("Conversations")]
    public async Task<IActionResult> GetConversations(
        CancellationToken cancellationToken)
    {
        var result =
            await _getConversationsHandler.Handle(
                new GetConversationsQuery(),
                cancellationToken);

        return Ok(result);
    }
}
