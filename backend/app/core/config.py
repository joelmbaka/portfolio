from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local", "backend/.env", "backend/.env.local"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    groq_api_key: str | None = Field(default=None, alias="GROQ_API_KEY")
    groq_model: str = Field(default="openai/gpt-oss-20b", alias="GROQ_MODEL")
    job_llm_enabled: bool = Field(default=True, alias="JOB_LLM_ENABLED")
    database_url: str | None = Field(default=None, alias="DATABASE_URL")
    wellfound_user_data_dir: str = Field(default=".wellfound-browser", alias="WELLFOUND_USER_DATA_DIR")
    wellfound_browser_executable: str | None = Field(default=None, alias="WELLFOUND_BROWSER_EXECUTABLE")
    wellfound_cdp_url: str | None = Field(default=None, alias="WELLFOUND_CDP_URL")
    wellfound_headless: bool = Field(default=False, alias="WELLFOUND_HEADLESS")
    wellfound_scroll_pause_ms: int = Field(default=1600, alias="WELLFOUND_SCROLL_PAUSE_MS")
    wellfound_max_stale_scrolls: int = Field(default=5, alias="WELLFOUND_MAX_STALE_SCROLLS")
    wellfound_oldest_days: int = Field(default=31, alias="WELLFOUND_OLDEST_DAYS")
    wellfound_export_dir: str = Field(default="exports/wellfound", alias="WELLFOUND_EXPORT_DIR")
    wellfound_challenge_wait_seconds: int = Field(default=300, alias="WELLFOUND_CHALLENGE_WAIT_SECONDS")
    linkedin_cdp_url: str | None = Field(default=None, alias="LINKEDIN_CDP_URL")
    linkedin_export_dir: str = Field(default="exports/linkedin", alias="LINKEDIN_EXPORT_DIR")
    linkedin_scroll_pause_ms: int = Field(default=1400, alias="LINKEDIN_SCROLL_PAUSE_MS")
    linkedin_max_stale_scrolls: int = Field(default=4, alias="LINKEDIN_MAX_STALE_SCROLLS")
    linkedin_oldest_days: int = Field(default=7, alias="LINKEDIN_OLDEST_DAYS")
    yc_export_dir: str = Field(default="exports/yc", alias="YC_EXPORT_DIR")
    yc_scroll_pause_ms: int = Field(default=800, alias="YC_SCROLL_PAUSE_MS")
    yc_max_stale_scrolls: int = Field(default=2, alias="YC_MAX_STALE_SCROLLS")
    yc_browser_executable: str | None = Field(default=None, alias="YC_BROWSER_EXECUTABLE")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
