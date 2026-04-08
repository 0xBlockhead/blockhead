import type { Attachment } from 'svelte/attachments'

/** IntersectionObserver attachment: calls onVisible when element enters view; optionally call onChange(isVisible) on each intersection change. */
export const visibility = ({
	onVisible,
	onChange,
	options = {},
}: {
	onVisible?: () => void
	onChange?: (isVisible: boolean) => void
	options?: IntersectionObserverInit
}): Attachment<Element> => (
	(element) => {
		const observer = new IntersectionObserver(
			([entry]) => {
				const visible = entry.isIntersecting
				if (visible) onVisible?.()
				onChange?.(visible)
			},
			{
				rootMargin: '200px',
				...options,
				root: options.root ?? element.closest('[data-scroll-container]'),
			},
		)

		observer.observe(element)

		return () => observer.disconnect()
	}
)
