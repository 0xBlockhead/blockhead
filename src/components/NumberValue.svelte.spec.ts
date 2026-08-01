import { expect, test } from 'vitest'
import { render } from 'vitest-browser-svelte'

import { formatValue } from '$/lib/number.ts'
import NumberValue from '$/components/NumberValue.svelte'


test('formats a number and forwards output attributes', async () => {
	const { container } = await render(NumberValue, {
		value: 1234.5,
		class: 'balance',
		'aria-label': 'Balance',
	})
	const output = container.querySelector('output')

	expect(output?.textContent).toBe(new Intl.NumberFormat().format(1234.5))
	expect(output?.classList.contains('number-value')).toBe(true)
	expect(output?.classList.contains('balance')).toBe(true)
	expect(output?.getAttribute('aria-label')).toBe('Balance')
})

test('formats a bigint with decimal places without losing precision', async () => {
	const { container } = await render(NumberValue, {
		value: 123450n,
		decimalPlaces: 2,
	})

	expect(container.querySelector('output')?.textContent).toBe(
		`${new Intl.NumberFormat(undefined, {
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(1234n)}${new Intl.NumberFormat()
			.formatToParts(1.1)
			.find((part) => part.type === 'decimal')
			?.value ?? '.'}5`
	)
})

test('applies native and domain number-format options', async () => {
	const native = await render(NumberValue, {
		value: 1234.5,
		options: {
			currency: 'USD',
			style: 'currency',
		},
	})
	const domain = await render(NumberValue, {
		value: 1234.5,
		formatValueOptions: {
			showDecimalPlaces: 2,
			useGrouping: false,
		},
	})

	expect(native.container.querySelector('output')?.textContent).toBe(
		new Intl.NumberFormat(undefined, {
			currency: 'USD',
			style: 'currency',
		}).format(1234.5)
	)
	expect(domain.container.querySelector('output')?.textContent).toBe(
		formatValue(1234.5, {
			showDecimalPlaces: 2,
			useGrouping: false,
		})
	)
})

test('omits an undefined value and preserves native non-finite formatting', async () => {
	const rendered = await render(NumberValue, {
		value: undefined,
	})

	expect(rendered.container.querySelector('output')).toBeNull()

	await rendered.rerender({
		value: Number.NaN,
	})
	expect(rendered.container.querySelector('output')?.textContent).toBe(
		new Intl.NumberFormat().format(Number.NaN)
	)

	await rendered.rerender({
		value: Number.POSITIVE_INFINITY,
	})
	expect(rendered.container.querySelector('output')?.textContent).toBe(
		new Intl.NumberFormat().format(Number.POSITIVE_INFINITY)
	)
})
