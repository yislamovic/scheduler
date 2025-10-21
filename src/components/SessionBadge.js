import React from "react";

export default function SessionBadge({ sessionId }) {
  if (!sessionId) return null;

  const shortId = sessionId.slice(0, 8);

  return (
    <div className="session-badge">
      <div className="session-badge__content">
        <span className="session-badge__icon">🎭</span>
        <span className="session-badge__text">Demo Session</span>
        <span className="session-badge__id">{shortId}</span>
      </div>
      <div className="session-badge__tooltip">
        Your changes are isolated to this session.
        <br />
        Refresh the page to reset.
      </div>
    </div>
  );
}
