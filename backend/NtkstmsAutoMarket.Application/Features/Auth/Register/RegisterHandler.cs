using Microsoft.EntityFrameworkCore;
using NtkstmsAutoMarket.Application.Common.Interfaces;
using NtkstmsAutoMarket.Domain.Entities;

namespace NtkstmsAutoMarket.Application.Features.Auth.Register;

public class RegisterHandler
{
	private readonly IApplicationDbContext _context;

	public RegisterHandler(IApplicationDbContext context)
	{
		_context = context;
	}

	public async Task<RegisterResult> Handle(
		RegisterCommand command,
		CancellationToken cancellationToken = default)
	{
		var firstName = command.FirstName.Trim();
		var lastName = command.LastName.Trim();
		var username = command.Username.Trim().ToLowerInvariant();
		var email = command.Email.Trim().ToLowerInvariant();

		if (string.IsNullOrWhiteSpace(firstName))
			throw new ArgumentException("First name is required.");

		if (string.IsNullOrWhiteSpace(lastName))
			throw new ArgumentException("Last name is required.");

		if (string.IsNullOrWhiteSpace(username))
			throw new ArgumentException("Username is required.");

		if (string.IsNullOrWhiteSpace(email))
			throw new ArgumentException("Email is required.");

		if (string.IsNullOrWhiteSpace(command.Password))
			throw new ArgumentException("Password is required.");

		if (command.Password.Length < 8)
			throw new ArgumentException(
				"Password must be at least 8 characters long.");

		var emailExists = await _context.Users
			.AnyAsync(
				user => user.Email == email,
				cancellationToken);

		if (emailExists)
			throw new InvalidOperationException(
				"An account with this email already exists.");

		var usernameExists = await _context.Users
			.AnyAsync(
				user => user.Username == username,
				cancellationToken);

		if (usernameExists)
			throw new InvalidOperationException(
				"This username is already taken.");

		var passwordHash = BCrypt.Net.BCrypt.HashPassword(
			command.Password);

		var user = new User(
			firstName,
			lastName,
			username,
			email,
			passwordHash);

		_context.Users.Add(user);

		await _context.SaveChangesAsync(cancellationToken);

		return new RegisterResult(
			user.Id,
			user.Username,
			user.Email);
	}
}