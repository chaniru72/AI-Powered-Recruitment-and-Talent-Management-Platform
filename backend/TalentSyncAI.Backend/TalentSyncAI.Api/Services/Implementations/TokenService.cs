using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TalentSyncAI.Api.Configuration;
using TalentSyncAI.Api.DTOs.Auth;
using TalentSyncAI.Api.Models.Entities;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class TokenService : ITokenService
    {
        private readonly JwtSettings _jwtSettings;

        public TokenService(IOptions<JwtSettings> jwtOptions)
        {
            _jwtSettings = jwtOptions.Value;

            if (string.IsNullOrWhiteSpace(_jwtSettings.Key))
            {
                throw new InvalidOperationException(
                    "The JWT signing key has not been configured.");
            }

            if (Encoding.UTF8.GetByteCount(_jwtSettings.Key) < 32)
            {
                throw new InvalidOperationException(
                    "The JWT signing key must contain at least 32 bytes.");
            }
        }

        public TokenResult CreateToken(User user)
        {
            DateTime expiresAt = DateTime.UtcNow
                .AddMinutes(_jwtSettings.ExpiryMinutes);

            var claims = new List<Claim>
            {
                new(
                    ClaimTypes.NameIdentifier,
                    user.Id.ToString()),

                new(
                    ClaimTypes.Name,
                    user.FullName),

                new(
                    ClaimTypes.Email,
                    user.Email),

                new(
                    ClaimTypes.Role,
                    user.Role.ToString()),

                new(
                    JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString())
            };

            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtSettings.Key));

            var signingCredentials = new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256);

            var jwtToken = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expiresAt,
                signingCredentials: signingCredentials);

            string accessToken =
                new JwtSecurityTokenHandler().WriteToken(jwtToken);

            return new TokenResult
            {
                AccessToken = accessToken,
                ExpiresAt = expiresAt
            };
        }
    }
}