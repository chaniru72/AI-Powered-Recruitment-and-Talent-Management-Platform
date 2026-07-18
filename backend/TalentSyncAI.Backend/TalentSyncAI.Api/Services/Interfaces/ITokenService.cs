using TalentSyncAI.Api.DTOs.Auth;
using TalentSyncAI.Api.Models.Entities;

namespace TalentSyncAI.Api.Services.Interfaces
{
    public interface ITokenService
    {
        TokenResult CreateToken(User user);
    }
}