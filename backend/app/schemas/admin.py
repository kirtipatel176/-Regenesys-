from typing import List

from pydantic import BaseModel


class UserStatusUpdate(BaseModel):
    is_active: bool


class AdminStatsResponse(BaseModel):
    total_users: int
    total_docs: int
    processed_docs: int
    failed_docs: int
    total_chats_today: int
