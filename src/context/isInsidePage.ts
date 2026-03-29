import { useGetSetContext } from '$/context/useContext.ts'

const {
	get: getIsInsidePage,
	set: setIsInsidePage,
} = useGetSetContext<boolean>(
	Symbol('isInsidePage')
)

export {
	getIsInsidePage,
	setIsInsidePage,
}
