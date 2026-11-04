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
		var firstName = (command.FirstName ?? string.Empty).Trim();
		var lastName = (command.LastName ?? string.Empty).Trim();
		var username = (command.Username ?? string.Empty).Trim().ToLowerInvariant();
		var email = (command.Email ?? string.Empty).Trim().ToLowerInvariant();

		if (string.IsNullOrWhiteSpace(firstName))
			throw new ArgumentException("First name is required.");

		if (string.IsNullOrWhiteSpace(lastName))
			throw new ArgumentException("Last name is required.");

		if (string.IsNullOrWhiteSpace(username))
			throw new ArgumentException("Username is required.");

		if (string.IsNullOrWhiteSpace(email))
			throw new ArgumentException("Email is required.");

		if (firstName.Length > 50 || lastName.Length > 50)
			throw new ArgumentException("Names must be 50 characters or fewer.");

		if (!System.Text.RegularExpressions.Regex.IsMatch(username, "^[a-z0-9_.-]{3,30}$"))
			throw new ArgumentException(
				"Username must be 3-30 characters: letters, numbers, dots, dashes or underscores.");

		if (email.Length > 254 || !System.Text.RegularExpressions.Regex.IsMatch(
				email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
			throw new ArgumentException("Enter a valid email address.");

		if (string.IsNullOrWhiteSpace(command.Password))
			throw new ArgumentException("Password is required.");

		if (command.Password.Length < 8)
			throw new ArgumentException(
				"Password must be at least 8 characters long.");

		// BCrypt silently ignores bytes past 72, so longer passwords would give a false sense of strength.
		if (System.Text.Encoding.UTF8.GetByteCount(command.Password) > 72)
			throw new ArgumentException(
				"Password must be at most 72 bytes long.");

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