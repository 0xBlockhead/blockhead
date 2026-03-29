import { getIsInsidePage } from '$/context/isInsidePage.ts'
import { useGetSetContext } from '$/context/useContext.ts'

const {
	get: getHeadingLevel,
	set: setHeadingLevel,
} = useGetSetContext<number>(
	Symbol('headingLevel'),
	() => 0
)

export {
	getHeadingLevel,
	setHeadingLevel,
}

export const incrementHeadingLevel = () => {
	if(getIsInsidePage())
		setHeadingLevel(
			getHeadingLevel() + 1
		)
}
