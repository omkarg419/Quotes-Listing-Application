import { useEffect, useState } from "react";

const API_URL = "https://api.freeapi.app/api/v1/public/quotes";

function App() {
	const [quotes, setQuotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [lastUpdated, setLastUpdated] = useState("");

	useEffect(() => {
		const controller = new AbortController();

		async function loadQuotes() {
			try {
				setLoading(true);
				setError("");

				const response = await fetch(API_URL, { signal: controller.signal });

				if (!response.ok) {
					throw new Error("Unable to load quotes right now.");
				}

				const payload = await response.json();
				const items = payload?.data?.data ?? [];

				setQuotes(items);
				setLastUpdated(new Date().toLocaleString());
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setError(
						fetchError.message || "Something went wrong while loading quotes.",
					);
				}
			} finally {
				setLoading(false);
			}
		}

		loadQuotes();

		return () => controller.abort();
	}, []);

	return (
		<main className="page-shell">
			<section className="hero">
				<div>
					<p className="eyebrow">FreeAPI quote gallery</p>
					<h1>Browse a curated collection of quotes</h1>
					<p className="hero-copy">
						A clean reading layout for exploring quotes by author, theme, and
						length.
					</p>
				</div>

				<div className="hero-panel">
					<span>Source</span>
					<strong>api.freeapi.app</strong>
					<p>
						Fresh content is loaded directly from the public quotes endpoint.
					</p>
				</div>
			</section>

			<section
				className="toolbar"
				aria-label="Quotes summary"
			>
				<div>
					<span className="toolbar-label">Quotes loaded</span>
					<strong>{quotes.length}</strong>
				</div>
				<div>
					<span className="toolbar-label">Status</span>
					<strong>
						{loading ? "Loading" : error ? "Needs attention" : "Ready"}
					</strong>
				</div>
				<div>
					<span className="toolbar-label">Last updated</span>
					<strong>{lastUpdated || "Just now"}</strong>
				</div>
			</section>

			{error ? <div className="notice error">{error}</div> : null}

			{loading ? <div className="notice">Loading quotes...</div> : null}

			{!loading && !error && (
				<section
					className="quotes-grid"
					aria-label="Quotes list"
				>
					{quotes.map((quote) => (
						<article
							className="quote-card"
							key={quote.id}
						>
							<div className="quote-mark">“</div>
							<p className="quote-content">{quote.content}</p>

							<footer className="quote-footer">
								<div>
									<strong>{quote.author}</strong>
									<span>{quote.authorSlug}</span>
								</div>
								<span className="quote-length">{quote.length} chars</span>
							</footer>

							{quote.tags?.length ? (
								<ul
									className="tag-list"
									aria-label={`Tags for ${quote.author}`}
								>
									{quote.tags.map((tag) => (
										<li key={tag}>{tag}</li>
									))}
								</ul>
							) : null}
						</article>
					))}
				</section>
			)}
		</main>
	);
}

export default App;
