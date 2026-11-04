
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NtkstmsAutoMarket.API.Extensions;
using NtkstmsAutoMarket.Application.Features.Messaging.GetConversations;
using NtkstmsAutoMarket.Application.Features.Messaging.GetConversationMessages;
using NtkstmsAutoMarket.Application.Features.Messaging.StartConversation;
using NtkstmsAutoMarket.Application.Features.Messaging.MarkConversationAsRead;
using NtkstmsAutoMarket.Application.Features.Messaging.SendMessage;

namespace NtkstmsAutoMarket.API.Controllers;

[ApiController]
[Route("api")]
public class MessagingController : ControllerBase
{
    private readonly StartConversationHandler
        _startConversationHandler;

    private readonly GetConversationsHandler
        _getConversationsHandler;

    private readonly GetConversationMessagesHandler
        _getConversationMessagesHandler;

    private readonly MarkConversationAsReadHandler
        _markConversationAsReadHandler;

    private readonly SendMessageHandler
        _sendMessageHandler;

    private readonly StartDirectConversationHandler
        _startDirectConversationHandler;

    public MessagingController(
        StartConversationHandler startConversationHandler,
        StartDirectConversationHandler startDirectConversationHandler,
        GetConversationsHandler getConversationsHandler,
        GetConversationMessagesHandler getConversationMessagesHandler,
        MarkConversationAsReadHandler markConversationAsReadHandler,
        SendMessageHandler sendMessageHandler)
    {
        _startConversationHandler = startConversationHandler;
        _startDirectConversationHandler = startDirectConversationHandler;
        _getConversationsHandler = getConversationsHandler;
        _getConversationMessagesHandler = getConversationMessagesHandler;
        _markConversationAsReadHandler = markConversationAsReadHandler;
        _sendMessageHandler = sendMessageHandler;
    }

    [Authorize]
    [EnableRateLimiting(RateLimitPolicies.Messaging)]
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
    [EnableRateLimiting(RateLimitPolicies.Messaging)]
    [HttpPost("Users/{userId:guid}/conversations")]
    public async Task<IActionResult> StartDirectConversation(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var result =
            await _startDirectConversationHandler.Handle(
                userId,
                cancellationToken);

        return Ok(new { conversationId = result.ConversationId });
    }

    [Authorize]
    [HttpGet("Conversations")]
    public async Task<IActionResult> GetConversations(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        if (page < 1)
        {
            return BadRequest(new
            {
                message = "Page must be at least 1."
            });
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest(new
            {
                message = "Page size must be between 1 and 100."
            });
        }

        var result =
            await _getConversationsHandler.Handle(
                new GetConversationsQuery(page, pageSize),
                cancellationToken);

        return Ok(result);
    }

    [Authorize]
    [HttpGet("Conversations/{conversationId:guid}/Messages")]
    public async Task<IActionResult> GetConversationMessages(
        Guid conversationId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
    {
        if (page < 1)
        {
            return BadRequest(new
            {
                message = "Page must be at least 1."
            });
        }

        if (pageSize < 1 || pageSize > 100)
        {
            return BadRequest(new
            {
                message = "Page size must be between 1 and 100."
            });
        }

        var result =
            await _getConversationMessagesHandler.Handle(
                new GetConversationMessagesQuery(
                    conversationId,
                    page,
                    pageSize),
                cancellationToken);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }


    [Authorize]
    [HttpPut("Conversations/{conversationId:guid}/read")]
    public async Task<IActionResult> MarkConversationAsRead(
        Guid conversationId,
        CancellationToken cancellationToken)
    {
        var result =
            await _markConversationAsReadHandler.Handle(
                new MarkConversationAsReadCommand(conversationId),
                cancellationToken);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(new
        {
            markedCount = result.Value
        });
    }

    [Authorize]
    [EnableRateLimiting(RateLimitPolicies.Messaging)]
    [HttpPost("Conversations/{conversationId:guid}/Messages")]
    public async Task<IActionResult> SendMessage(
        Guid conversationId,
        SendMessageRequest request,
        CancellationToken cancellationToken)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Body))
        {
            return BadRequest(new
            {
                message = "Message cannot be empty."
            });
        }

        if (request.Body.Length > 4000)
        {
            return BadRequest(new
            {
                message = "Message cannot exceed 4000 characters."
            });
        }

        var result = await _sendMessageHandler.Handle(
            new SendMessageCommand(conversationId, request.Body),
            cancellationToken);

        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }
}
