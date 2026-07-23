using System.Net.Http.Headers;
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

        public GeminiClient(
            HttpClient httpClient,
            IOptions<GeminiSettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;

            if (!string.IsNullOrWhiteSpace(_settings.BaseUrl))
            {
                _httpClient.BaseAddress =
                    new Uri(_settings.BaseUrl.TrimEnd('/'));
            }

            _httpClient.Timeout = TimeSpan.FromSeconds(120);
        }

        public async Task<string> GenerateContentAsync(
            string prompt,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(_settings.ApiKey))
            {
                throw new InvalidOperationException(
                    "Gemini API key is not configured.");
            }

            if (string.IsNullOrWhiteSpace(_settings.Model))
            {
                throw new InvalidOperationException(
                    "Gemini model is not configured.");
            }

            if (string.IsNullOrWhiteSpace(_settings.BaseUrl))
            {
                throw new InvalidOperationException(
                    "Gemini base URL is not configured.");
            }

            if (string.IsNullOrWhiteSpace(prompt))
            {
                return string.Empty;
            }

            string modelName =
                _settings.Model.StartsWith("models/")
                    ? _settings.Model
                    : $"models/{_settings.Model}";

            string requestUrl =
                $"/v1beta/{modelName}:generateContent";

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
                },
                generationConfig = new
                {
                    temperature = 0.2,
                    maxOutputTokens = 300,
                    responseMimeType = "application/json"
                }
            };

            using var request =
                new HttpRequestMessage(
                    HttpMethod.Post,
                    requestUrl);

            request.Headers.Add(
                "x-goog-api-key",
                _settings.ApiKey);

            request.Headers.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

            request.Content =
                JsonContent.Create(requestBody);

            using var response =
                await _httpClient.SendAsync(
                    request,
                    cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                string errorBody =
                    await response.Content
                        .ReadAsStringAsync(cancellationToken);

                throw new InvalidOperationException(
                    $"Gemini API request failed with status code {(int)response.StatusCode}. Response: {errorBody}");
            }

            await using var responseStream =
                await response.Content
                    .ReadAsStreamAsync(cancellationToken);

            var geminiResponse =
                await JsonSerializer.DeserializeAsync
                    <GeminiGenerateContentResponse>(
                        responseStream,
                        new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        },
                        cancellationToken);

            string? text =
                geminiResponse?
                    .Candidates?
                    .FirstOrDefault()?
                    .Content?
                    .Parts?
                    .FirstOrDefault()?
                    .Text;

            if (string.IsNullOrWhiteSpace(text))
            {
                throw new InvalidOperationException(
                    "Gemini returned an empty text response.");
            }

            return text.Trim();
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