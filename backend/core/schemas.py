from typing import List
from pydantic import BaseModel, HttpUrl

class AuditRequest(BaseModel):
    url: HttpUrl

class AuditIssue(BaseModel):
    title: str
    description: str
    suggested_fix: str

class AuditReport(BaseModel):
    audit_summary: str
    issues: List[AuditIssue]
