namespace NtkstmsAutoMarket.Application.Features.Messaging.SendMessage;

public class SendMessageResponse
{
    public Guid Id { get; set; }

    public Guid ConversationId { get; set; }

    public Guid SenderId { get; set; }

    public string Body { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? ReadAt { get; set; }
}