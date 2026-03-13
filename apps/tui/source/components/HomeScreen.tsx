import { Box, Text } from "ink";
import { add, multiply } from "@mono/math-utils";
export function HomeScreen() {

	return (
		<Box >
			<Text> hello Home </Text>
			<Text> {add(1, 2)} </Text>
			<Text> {multiply(6, 7)} </Text>
		</Box>
	)
}
