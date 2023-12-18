import { Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window')

function get_width(width_percentage) {
    return width - ((100 - width_percentage) / 100 ) * width
}

function get_height(height_percentage) {
    return height - ((100 - height_percentage) / 100 ) * height
}

export { get_width, get_height }
