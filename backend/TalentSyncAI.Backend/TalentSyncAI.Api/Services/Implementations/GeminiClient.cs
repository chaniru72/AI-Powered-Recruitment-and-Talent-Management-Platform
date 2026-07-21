using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using TalentSyncAI.Api.Configuration;
using TalentSyncAI.Api.Services.Interfaces;

namespace TalentSyncAI.Api.Services.Implementations
{
    public class GeminiClient : IGeminiClient
    {
        private readonly HttpClient _httpClient;
        private readonly GeminiSettings _settings;

        public GeminiClient(HttpClient httpClient, IOptions<GeminiSettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;

            if (!string.IsNullOrWhiteSpace(_settings.BaseUrl))
            {
                _httpClient.BaseAddress = new Uri(_settings.BaseUrl.TrimEnd('/'));
            }
        }

        public async Task<string> GenerateContentAsync(
            string prompt,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(_settings.ApiKey))
            {
                throw new InvalidOperationException("Gemini API key is not configured.");
            }

            if (string.IsNullOrWhiteSpace(prompt))
            {
                return string.Empty;
            }

            var modelName = _settings.Model.StartsWith("models/")
                ? _settings.Model
                : $"models/{_settings.Model}";

            var requestUrl = $"/v1beta/{modelName}:generateContent";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[]
                        {
                            new
                            {
                                text = prompt
                            }
                        }
                    }
                }
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, requestUrl);
            request.Headers.Add("x-goog-api-key", _settings.ApiKey);
            request.Content = JsonContent.Create(requestBody);

            using var response = await _httpClient.SendAsync(request, cancellationToken);

            if (!response.IsSuccessStatusCode)
{
    var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);

    throw new InvalidOperationException(
        $"Gemini API request failed with status code {(int)response.StatusCode}. Response: {errorBody}");
}

            await using var responseStream =
                await response.Content.ReadAsStreamAsync(cancellationToken);

            var geminiResponse =
                await JsonSerializer.DeserializeAsync<GeminiGenerateContentResponse>(
                    responseStream,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    },
                    cancellationToken);

            var text = geminiResponse?
                .Candidates?
                .FirstOrDefault()?
                .Content?
                .Parts?
                .FirstOrDefault()?
                .Text;

            return text?.Trim() ?? string.Empty;
        }

        private class GeminiGenerateContentResponse
        {
            public List<GeminiCandidate>? Candidates { get; set; }
        }

        private class GeminiCandidate
        {
            public GeminiContent? Content { get; set; }
        }

        private class GeminiContent
        {
            public List<GeminiPart>? Parts { get; set; }
        }

        private class GeminiPart
        {
            public string? Text { get; set; }
        }
    }
}