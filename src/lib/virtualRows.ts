import { layout, prepare, type PreparedText } from '@chenglou/pretext'

export type VirtualRowMeasurement<_Row> = {
	font: string
	lineHeight: number
	getMeasureText: (row: _Row, index: number) => string
	rowInsetBlock?: number
	itemGap?: number
	overscan?: number
}

export const measureVirtualRows = <_Row,>({
	rows,
	width,
	measurement,
	preparedByKey = new Map<string, PreparedText>(),
}: {
	rows: readonly _Row[]
	width: number
	measurement: VirtualRowMeasurement<_Row>
	preparedByKey?: Map<string, PreparedText>
}) => {
	const measuredWidth = Math.max(
		1,
		width
	)
	const rowHeights: number[] = []
	const offsets: number[] = [
		0,
	]
	let totalHeight = 0
	for (
		let index = 0;
		index < rows.length;
		index++
	) {
		const text = measurement.getMeasureText(
			rows[index],
			index
		)
		const cacheKey = `${measurement.font}\0${text}`
		let prepared = preparedByKey.get(cacheKey)
		if (!prepared) {
			prepared = prepare(
				text,
				measurement.font
			)
			preparedByKey.set(
				cacheKey,
				prepared
			)
		}

		const rowHeight = (
			layout(
				prepared,
				measuredWidth,
				measurement.lineHeight
			).height
			+ (measurement.rowInsetBlock ?? 0)
			+ (
				index < rows.length - 1 ?
					(measurement.itemGap ?? 0)
				:
					0
			)
		)
		rowHeights.push(rowHeight)
		totalHeight += rowHeight
		offsets.push(totalHeight)
	}

	return {
		rowHeights,
		offsets,
		totalHeight,
	}
}

export const getVisibleVirtualRange = ({
	offsets,
	scrollTop,
	viewportHeight,
	overscan = 4,
}: {
	offsets: number[]
	scrollTop: number
	viewportHeight: number
	overscan?: number
}) => {
	const rowCount = offsets.length - 1
	if (
		rowCount <= 0
		|| viewportHeight <= 0
	) return {
		start: 0,
		end: -1,
	}

	const viewportBottom = scrollTop + viewportHeight
	let lo = 0
	let hi = rowCount - 1
	while (
		lo < hi
	) {
		const mid = (
			lo + hi
		) >> 1
		if (
			offsets[mid + 1] <= scrollTop
		) lo = mid + 1
		else hi = mid
	}

	const start = Math.max(
		0,
		lo - overscan
	)
	let end = lo
	while (
		end < rowCount - 1
		&& offsets[end + 1] <= viewportBottom
	) end++

	return {
		start,
		end: Math.min(
			rowCount - 1,
			end + overscan
		),
	}
}
