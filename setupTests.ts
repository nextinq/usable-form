/* eslint-disable @typescript-eslint/explicit-function-return-type */
// @ts-nocheck
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
