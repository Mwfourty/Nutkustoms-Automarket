using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NtkstmsAutoMarket.API.Authentication;
using NtkstmsAutoMarket.Infrastructure.Persistence;
using NtkstmsAutoMarket.Application;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Infrastructure.Authentication;

using NtkstmsAutoMarket.Application.Features.Listings.GetListings;
using NtkstmsAutoMarket.Application.Features.Listings.GetMyListings;
using NtkstmsAutoMarket.Application.Features.Listings.CreateListing;
using NtkstmsAutoMarket.Application.Features.Listings.GetListingById;
using NtkstmsAutoMarket.Application.Features.Vehicles.CreateVehicle;
using NtkstmsAutoMarket.Application.Features.Parts.CreatePart;
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

using NtkstmsAutoMarket.API.ExceptionHandling;
using NtkstmsAutoMarket.API.Extensions;
using NtkstmsAutoMarket.API.Filters;

using NtkstmsAutoMarket.Application.Features.Auth.Login;
using NtkstmsAutoMarket.Application.Features.Auth.Register;

using NtkstmsAutoMarket.Application.Features.Messaging.StartConversation;
using NtkstmsAutoMarket.Application.Features.Messaging.GetConversations;
using NtkstmsAutoMarket.Application.Features.Messaging.GetConversationMessages;
using NtkstmsAutoMarket.Application.Features.Messaging.MarkConversationAsRead;
using NtkstmsAutoMarket.Application.Features.Messaging.SendMessage;

using NtkstmsAutoMarket.Application.Features.Garage.CreateGarageVehicle;
using NtkstmsAutoMarket.Application.Features.Garage.Likes;
using NtkstmsAutoMarket.Application.Features.Listings.CarOfTheWeek;
using NtkstmsAutoMarket.Application.Features.Garage.DeleteGarageVehicle;
using NtkstmsAutoMarket.Application.Features.Garage.Images.AddGarageVehicleImage;
using NtkstmsAutoMarket.Application.Features.Garage.Images.VehiclePhoto;
using NtkstmsAutoMarket.Application.Features.Garage.Images.DeleteGarageVehicleImage;
using NtkstmsAutoMarket.Application.Features.Garage.Images.GetGarageVehicleImages;
using NtkstmsAutoMarket.Application.Features.Garage.Images.SetPrimaryGarageVehicleImage;
using NtkstmsAutoMarket.Application.Features.Garage.GetGarageVehicle;
using NtkstmsAutoMarket.Application.Features.Garage.GetMyGarage;
using NtkstmsAutoMarket.Application.Features.Garage.GetPublicGarage;
using NtkstmsAutoMarket.Application.Features.Garage.GetGarageDirectory;
using NtkstmsAutoMarket.Application.Features.Garage.GetUserGarage;
using NtkstmsAutoMarket.Application.Features.Garage.SellGarageVehicle;
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

using NtkstmsAutoMarket.Application.Features.SellerReviews.CreateSellerReview;
using NtkstmsAutoMarket.Application.Features.SellerReviews.DeleteSellerReview;
using NtkstmsAutoMarket.Application.Features.SellerReviews.GetSellerReviews;
using NtkstmsAutoMarket.Application.Features.SellerReviews.UpdateSellerReview;

using NtkstmsAutoMarket.Application.Features.Users.GetMyProfile;
using NtkstmsAutoMarket.Application.Features.Users.GetPublicProfile;
using NtkstmsAutoMarket.Application.Features.Users.UpdateMyProfile;
using NtkstmsAutoMarket.Application.Features.Users.UpdateProfileImage;
using NtkstmsAutoMarket.Application.Features.Users.SavedListings;
using NtkstmsAutoMarket.Application.Features.Users.ProfileImage;
using NtkstmsAutoMarket.Application.Features.Users.Account;
using NtkstmsAutoMarket.Infrastructure.Storage;
using System.Security.Claims;
using NtkstmsAutoMarket.Application.Features.Users.SavedContacts;
using NtkstmsAutoMarket.Application.Features.Auth.Logout;
using System.IdentityModel.Tokens.Jwt;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();

builder.Services.AddControllers(options =>
    options.Filters.Add<StringLengthGuardFilter>());

builder.Services.AddRateLimitingPolicies();

// Uploads cap at 5 MB; nothing legitimate needs more than this.
builder.WebHost.ConfigureKestrel(options =>
{
    options.AddServerHeader = false;
    options.Limits.MaxRequestBodySize = 8 * 1024 * 1024;
});

builder.Services.AddHsts(options =>
{
    options.MaxAge = TimeSpan.FromDays(365);
    options.IncludeSubDomains = true;
});

var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "ConnectionStrings:DefaultConnection must be configured.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddScoped<IApplicationDbContext>(
    provider => provider.GetRequiredService<ApplicationDbContext>());

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection(
        JwtSettings.SectionName));

var jwtSettings = builder.Configuration
    .GetSection(JwtSettings.SectionName)
    .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "JWT settings are missing.");

if (Encoding.UTF8.GetByteCount(jwtSettings.Key) < 32)
{
    throw new InvalidOperationException(
        "Jwt:Key must be configured with at least 32 bytes.");
}

builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtSettings.Issuer,

                ValidateAudience = true,
                ValidAudience = jwtSettings.Audience,

                ValidateLifetime = true,

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSettings.Key)),

                ClockSkew = TimeSpan.Zero
            };

        // Reject tokens ended by logout, a password change or deactivation, even though the JWT itself is unexpired.
        options.Events = new JwtBearerEvents
        {
            // Browsers authenticate through the HttpOnly cookie; an Authorization header still wins for API clients.
            OnMessageReceived = context =>
            {
                if (string.IsNullOrEmpty(context.Token) &&
                    context.Request.Cookies.TryGetValue(AuthCookie.Name, out var cookieToken))
                {
                    context.Token = cookieToken;
                }

                return Task.CompletedTask;
            },
            OnTokenValidated = async context =>
            {
                var principal = context.Principal;
                var cancellationToken = context.HttpContext.RequestAborted;

                var db = context.HttpContext.RequestServices
                    .GetRequiredService<IApplicationDbContext>();

                var jti = principal?.FindFirst(
                    JwtRegisteredClaimNames.Jti)?.Value;

                if (!string.IsNullOrEmpty(jti) &&
                    await db.RevokedTokens
                        .AsNoTracking()
                        .AnyAsync(x => x.Jti == jti, cancellationToken))
                {
                    context.Fail("Token has been revoked.");
                    return;
                }

                var userIdClaim = principal?.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

                if (!Guid.TryParse(userIdClaim, out var userId))
                    return;

                var account = await db.Users
                    .AsNoTracking()
                    .Where(x => x.Id == userId)
                    .Select(x => new { x.IsActive, x.PasswordChangedAt })
                    .FirstOrDefaultAsync(cancellationToken);

                if (account is null || !account.IsActive)
                {
                    context.Fail("Account is not active.");
                    return;
                }

                if (account.PasswordChangedAt is { } changedAt)
                {
                    var issuedAt = long.TryParse(
                        principal!.FindFirst(JwtRegisteredClaimNames.Iat)?.Value,
                        out var iat)
                        ? iat
                        : 0;

                    if (issuedAt < new DateTimeOffset(changedAt).ToUnixTimeSeconds())
                        context.Fail("Password was changed.");
                }
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<
    ICurrentUserService,
    CurrentUserService>();

builder.Services.AddScoped<
    ITokenService,
    JwtTokenService>();

builder.Services.AddSingleton<IAvatarStorage>(
    _ => new LocalAvatarStorage(
        Path.Combine(
            builder.Environment.ContentRootPath,
            "uploads",
            "avatars")));

builder.Services.AddScoped<ProfileImageHandler>();
builder.Services.AddSingleton<IGarageImageStorage>(
    _ => new LocalGarageImageStorage(
        Path.Combine(
            builder.Environment.ContentRootPath,
            "uploads",
            "garage")));
builder.Services.AddScoped<VehiclePhotoHandler>();
builder.Services.AddSingleton<IListingImageStorage>(
    _ => new LocalListingImageStorage(
        Path.Combine(
            builder.Environment.ContentRootPath,
            "uploads",
            "listings")));
builder.Services.AddScoped<UploadListingImageHandler>();
builder.Services.AddScoped<AccountHandler>();

builder.Services.AddScoped<CreateListingHandler>();
builder.Services.AddScoped<GetListingsHandler>();
builder.Services.AddScoped<GetMyListingsHandler>();
builder.Services.AddScoped<GetListingByIdHandler>();
builder.Services.AddScoped<CreateVehicleHandler>();
builder.Services.AddScoped<CreatePartHandler>();
builder.Services.AddScoped<UpdateListingHandler>();
builder.Services.AddScoped<RemoveListingHandler>();
builder.Services.AddScoped<AddListingImageHandler>();
builder.Services.AddScoped<GetListingImagesHandler>();
builder.Services.AddScoped<DeleteListingImageHandler>();
builder.Services.AddScoped<SetPrimaryListingImageHandler>();
builder.Services.AddScoped<AddListingDocumentHandler>();
builder.Services.AddScoped<GetListingDocumentsHandler>();
builder.Services.AddScoped<UpdateListingDocumentHandler>();
builder.Services.AddScoped<DeleteListingDocumentHandler>();
builder.Services.AddScoped<PublishListingHandler>();
builder.Services.AddScoped<ReserveListingHandler>();
builder.Services.AddScoped<MarkListingAsSoldHandler>();
builder.Services.AddScoped<RegisterHandler>();
builder.Services.AddScoped<LoginHandler>();
builder.Services.AddScoped<StartConversationHandler>();
builder.Services.AddScoped<StartDirectConversationHandler>();
builder.Services.AddScoped<GetConversationsHandler>();
builder.Services.AddScoped<GetConversationMessagesHandler>();
builder.Services.AddScoped<MarkConversationAsReadHandler>();
builder.Services.AddScoped<SendMessageHandler>();
builder.Services.AddScoped<GetMyProfileHandler>();
builder.Services.AddScoped<GetPublicProfileHandler>();
builder.Services.AddScoped<UpdateMyProfileHandler>();
builder.Services.AddScoped<UpdateProfileImageHandler>();
builder.Services.AddScoped<SavedListingsHandler>();
builder.Services.AddScoped<GarageVehicleLikesHandler>();
builder.Services.AddScoped<CarOfTheWeekHandler>();
builder.Services.AddScoped<SavedContactsHandler>();
builder.Services.AddScoped<LogoutHandler>();
builder.Services.AddScoped<CreateGarageVehicleHandler>();
builder.Services.AddScoped<DeleteGarageVehicleHandler>();
builder.Services.AddScoped<AddGarageVehicleImageHandler>();
builder.Services.AddScoped<DeleteGarageVehicleImageHandler>();
builder.Services.AddScoped<GetGarageVehicleImagesHandler>();
builder.Services.AddScoped<SetPrimaryGarageVehicleImageHandler>();
builder.Services.AddScoped<UpdateGarageVehicleHandler>();
builder.Services.AddScoped<UpdateGarageVehicleVisibilityHandler>();
builder.Services.AddScoped<GetMyGarageHandler>();
builder.Services.AddScoped<GetUserGarageHandler>();
builder.Services.AddScoped<GetGarageVehicleHandler>();
builder.Services.AddScoped<GetPublicGarageHandler>();
builder.Services.AddScoped<GetGarageDirectoryHandler>();
builder.Services.AddScoped<SellGarageVehicleHandler>();
builder.Services.AddScoped<CreateModificationHandler>();
builder.Services.AddScoped<DeleteModificationHandler>();
builder.Services.AddScoped<GetModificationsHandler>();
builder.Services.AddScoped<UpdateModificationHandler>();
builder.Services.AddScoped<CreateServiceRecordHandler>();
builder.Services.AddScoped<DeleteServiceRecordHandler>();
builder.Services.AddScoped<GetServiceRecordsHandler>();
builder.Services.AddScoped<UpdateServiceRecordHandler>();
builder.Services.AddScoped<CreateSellerReviewHandler>();
builder.Services.AddScoped<GetSellerReviewsHandler>();
builder.Services.AddScoped<UpdateSellerReviewHandler>();
builder.Services.AddScoped<DeleteSellerReviewHandler>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseSecurityHeaders();

app.UseAuthentication();
app.UseCsrfProtection();
app.UseRateLimiter();
app.UseAuthorization();

app.MapControllers();

app.Run();