import * as _ from 'lodash'

import { AccessibilitySiteColour } from '../types/disability-types'

const applySiteColourTemplate = (template: string) => {
  const templates = {
    byowave: 'W3sibmFtZSI6ImJ5b3dhdmUtY3RhLWNvbG91ciIsImRlc2MiOiJDYWxsIHRvIGFjdGlvbiBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDk1LCAxMDYsIDIxOSkifSx7Im5hbWUiOiJieW93YXZlLWN0YS1kYXJrLWNvbG91ciIsImRlc2MiOiJDYWxsIHRvIGFjdGlvbiBkYXJrIGNvbG91ciIsImNvbG91ciI6IiByZ2IoNzEsIDc2LCAxMzMpIn0seyJuYW1lIjoiYnlvd2F2ZS1jdGEtaG92ZXItY29sb3VyIiwiZGVzYyI6IkNhbGwgdG8gYWN0aW9uIGhvdmVyIGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTQyLCAxNTEsIDI0OSkifSx7Im5hbWUiOiJieW93YXZlLWN0YS1kaXNhYmxlZC1jb2xvdXIiLCJkZXNjIjoiQ2FsbCB0byBhY3Rpb24gZGlzYWJsZWQgY29sb3VyIiwiY29sb3VyIjoiIHJnYig3OCwgNjgsIDUzKSJ9LHsibmFtZSI6ImJ5b3dhdmUtY3RhLXRleHQtY29sb3VyIiwiZGVzYyI6IkNhbGwgdG8gYWN0aW9uIHRleHQgY29sb3VyIiwiY29sb3VyIjoiIHJnYigyMjAsIDIyMCwgMjIwKSJ9LHsibmFtZSI6ImJ5b3dhdmUtY3RhLWRpc2FibGVkLXRleHQtY29sb3VyIiwiZGVzYyI6IkNhbGwgdG8gYWN0aW9uIGRpc2FibGVkIHRleHQgY29sb3VyIiwiY29sb3VyIjoiIHJnYigxMjYsIDEyNiwgMTI2KSJ9LHsibmFtZSI6ImJ5b3dhdmUtYWxlcnQtY29sb3VyIiwiZGVzYyI6IkFsZXJ0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTI0LDE1LDIwOCkifSx7Im5hbWUiOiJieW93YXZlLWFsZXJ0LXRleHQtY29sb3VyIiwiZGVzYyI6IkFsZXJ0IHRleHQgY29sb3VyIiwiY29sb3VyIjoiIHJnYigyMTYsIDE3NSwgMjQ4KSJ9LHsibmFtZSI6ImJ5b3dhdmUtcGFyYWdyYXBoLXRleHQtY29sb3VyIiwiZGVzYyI6IlBhcmFncmFwaCB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTc4LCAxODEsIDIxMikifSx7Im5hbWUiOiJieW93YXZlLWhlYWRpbmctdGV4dC1jb2xvdXIiLCJkZXNjIjoiSGVhZGluZyB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMjAxLCAyMDQsIDIzMikifSx7Im5hbWUiOiJieW93YXZlLXBhbmVsLWJnLWNvbG91ciIsImRlc2MiOiJQYW5lbCBiYWNrZ3JvdW5kIGNvbG91ciIsImNvbG91ciI6IiByZ2IoMzgsNDAsNTYpIn0seyJuYW1lIjoiYnlvd2F2ZS1wYW5lbC1ob3Zlci1iZy1jb2xvdXIiLCJkZXNjIjoiUGFuZWwgaG92ZXIgY29sb3VyIiwiY29sb3VyIjoiIHJnYig1MSwgNTQsIDc1KSJ9LHsibmFtZSI6ImJ5b3dhdmUtcGFuZWwtdGV4dC1jb2xvdXIiLCJkZXNjIjoiUGFuZWwgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDEwMiwgMTA0LCAxMjgpIn0seyJuYW1lIjoiYnlvd2F2ZS1wYW5lbC10ZXh0LWxpZ2h0LWNvbG91ciIsImRlc2MiOiJQYW5lbCBsaWdodCB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTAzLDEwNiwxMzMpIn0seyJuYW1lIjoiYnlvd2F2ZS1pbnB1dGZpZWxkLWJnLWNvbG91ciIsImRlc2MiOiJJbnB1dCBmaWVsZCBiYWNrZ3JvdW5kIGNvbG91ciIsImNvbG91ciI6IiByZ2IoMjUsIDI2LCAzNCkifSx7Im5hbWUiOiJieW93YXZlLWlucHV0ZmllbGQtdGV4dC1jb2xvdXIiLCJkZXNjIjoiSW5wdXQgZmllbGQgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDEzNCwgMTM5LCAxODApIn0seyJuYW1lIjoiYnlvd2F2ZS1pbnB1dGZpZWxkLXRleHQtZGlzYWJsZWQtY29sb3VyIiwiZGVzYyI6IklucHV0IGZpZWxkIGRpc2FibGVkIHRleHQgY29sb3VyIiwiY29sb3VyIjoiIHJnYigxMjEsIDEyMSwgMTIxKSJ9LHsibmFtZSI6ImJ5b3dhdmUtaW5wdXRmaWVsZC1wbGFjZWhvbGRlci10ZXh0LWNvbG91ciIsImRlc2MiOiJJbnB1dCBmaWVsZCBwbGFjZWhvbGRlciB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoNjMsIDY1LCA4MikifSx7Im5hbWUiOiJieW93YXZlLWN1c3RvbS1jb250cm9sLWJvcmRlci1jb2xvdXIiLCJkZXNjIjoiRm9ybSBjb250cm9sIGJvcmRlciBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDg4LDEwMiwyMjMpIn0seyJuYW1lIjoiYnlvd2F2ZS1jdXN0b20tY29udHJvbC1iZy1jb2xvdXIiLCJkZXNjIjoiRm9ybSBjb250cm9sIGJhY2tncm91bmQgY29sb3VyIiwiY29sb3VyIjoiIHJnYig1OCw1Niw4MSkifSx7Im5hbWUiOiJieW93YXZlLWN1c3RvbS1jb250cm9sLWlubmVyLWNvbG91ciIsImRlc2MiOiJGb3JtIGNvbnRyb2wgaW5uZXIgY29sb3VyIiwiY29sb3VyIjoiIHJnYigxMzUsMTQ2LDI0NykifSx7Im5hbWUiOiJieW93YXZlLWN1c3RvbS1jb250cm9sLXRleHQtY29sb3VyIiwiZGVzYyI6IkZvcm0gY29udHJvbCB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTMyLDEzNiwxNjgpIn0seyJuYW1lIjoiYnlvd2F2ZS1pbWFnZS1ib3JkZXItY29sb3VyIiwiZGVzYyI6IkltYWdlIGJvcmRlciBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDgxLCA4MywgMTAzKSJ9LHsibmFtZSI6ImJ5b3dhdmUtc2Nyb2xsYmFyLWJnLWNvbG91ciIsImRlc2MiOiJTY3JvbGxiYXIgYmFja2dyb3VuZCBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDExLDE1LDMyKSJ9LHsibmFtZSI6ImJ5b3dhdmUtc2Nyb2xsYmFyLWhhbmRsZS1jb2xvdXIiLCJkZXNjIjoiU2Nyb2xsYmFyIGhhbmRsZSBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDgxLDExMSwyNDgpIn1d',
    beetrootBaby: 'W3sibmFtZSI6ImJ5b3dhdmUtY3RhLWNvbG91ciIsImRlc2MiOiJDYWxsIHRvIGFjdGlvbiBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoMTU0LDAsMjM3KSJ9LHsibmFtZSI6ImJ5b3dhdmUtY3RhLWRhcmstY29sb3VyIiwiZGVzYyI6IkNhbGwgdG8gYWN0aW9uIGRhcmsgY29sb3VyIiwiY29sb3VyIjoicmdiKDEzNSwzNSwxNDEpIn0seyJuYW1lIjoiYnlvd2F2ZS1jdGEtaG92ZXItY29sb3VyIiwiZGVzYyI6IkNhbGwgdG8gYWN0aW9uIGhvdmVyIGNvbG91ciIsImNvbG91ciI6InJnYigxNjksNzgsMjMyKSJ9LHsibmFtZSI6ImJ5b3dhdmUtY3RhLWRpc2FibGVkLWNvbG91ciIsImRlc2MiOiJDYWxsIHRvIGFjdGlvbiBkaXNhYmxlZCBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoNjEsMzMsNTkpIn0seyJuYW1lIjoiYnlvd2F2ZS1jdGEtdGV4dC1jb2xvdXIiLCJkZXNjIjoiQ2FsbCB0byBhY3Rpb24gdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDIyMCwgMjIwLCAyMjApIn0seyJuYW1lIjoiYnlvd2F2ZS1jdGEtZGlzYWJsZWQtdGV4dC1jb2xvdXIiLCJkZXNjIjoiQ2FsbCB0byBhY3Rpb24gZGlzYWJsZWQgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDEyNiwgMTI2LCAxMjYpIn0seyJuYW1lIjoiYnlvd2F2ZS1hbGVydC1jb2xvdXIiLCJkZXNjIjoiQWxlcnQgY29sb3VyIiwiY29sb3VyIjoiIHJnYigxMjQsMTUsMjA4KSJ9LHsibmFtZSI6ImJ5b3dhdmUtYWxlcnQtdGV4dC1jb2xvdXIiLCJkZXNjIjoiQWxlcnQgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDIxNiwgMTc1LCAyNDgpIn0seyJuYW1lIjoiYnlvd2F2ZS1wYXJhZ3JhcGgtdGV4dC1jb2xvdXIiLCJkZXNjIjoiUGFyYWdyYXBoIHRleHQgY29sb3VyIiwiY29sb3VyIjoicmdiKDE5MywxNTUsMjI2KSJ9LHsibmFtZSI6ImJ5b3dhdmUtaGVhZGluZy10ZXh0LWNvbG91ciIsImRlc2MiOiJIZWFkaW5nIHRleHQgY29sb3VyIiwiY29sb3VyIjoicmdiKDE5MiwxOTYsMjM0KSJ9LHsibmFtZSI6ImJ5b3dhdmUtcGFuZWwtYmctY29sb3VyIiwiZGVzYyI6IlBhbmVsIGJhY2tncm91bmQgY29sb3VyIiwiY29sb3VyIjoicmdiKDU3LDM3LDY3KSJ9LHsibmFtZSI6ImJ5b3dhdmUtcGFuZWwtaG92ZXItYmctY29sb3VyIiwiZGVzYyI6IlBhbmVsIGhvdmVyIGNvbG91ciIsImNvbG91ciI6InJnYigxMTUsNDcsMTM3KSJ9LHsibmFtZSI6ImJ5b3dhdmUtcGFuZWwtdGV4dC1jb2xvdXIiLCJkZXNjIjoiUGFuZWwgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoMjEwLDE2OSwyNDIpIn0seyJuYW1lIjoiYnlvd2F2ZS1wYW5lbC10ZXh0LWxpZ2h0LWNvbG91ciIsImRlc2MiOiJQYW5lbCBsaWdodCB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTAzLDEwNiwxMzMpIn0seyJuYW1lIjoiYnlvd2F2ZS1pbnB1dGZpZWxkLWJnLWNvbG91ciIsImRlc2MiOiJJbnB1dCBmaWVsZCBiYWNrZ3JvdW5kIGNvbG91ciIsImNvbG91ciI6InJnYigxMSw4LDEyKSJ9LHsibmFtZSI6ImJ5b3dhdmUtaW5wdXRmaWVsZC10ZXh0LWNvbG91ciIsImRlc2MiOiJJbnB1dCBmaWVsZCB0ZXh0IGNvbG91ciIsImNvbG91ciI6InJnYigxNTAsMzEsMjIzKSJ9LHsibmFtZSI6ImJ5b3dhdmUtaW5wdXRmaWVsZC10ZXh0LWRpc2FibGVkLWNvbG91ciIsImRlc2MiOiJJbnB1dCBmaWVsZCBkaXNhYmxlZCB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTIxLCAxMjEsIDEyMSkifSx7Im5hbWUiOiJieW93YXZlLWlucHV0ZmllbGQtcGxhY2Vob2xkZXItdGV4dC1jb2xvdXIiLCJkZXNjIjoiSW5wdXQgZmllbGQgcGxhY2Vob2xkZXIgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoODQsMzgsODYpIn0seyJuYW1lIjoiYnlvd2F2ZS1jdXN0b20tY29udHJvbC1ib3JkZXItY29sb3VyIiwiZGVzYyI6IkZvcm0gY29udHJvbCBib3JkZXIgY29sb3VyIiwiY29sb3VyIjoicmdiKDEzMSwyOSwxODYpIn0seyJuYW1lIjoiYnlvd2F2ZS1jdXN0b20tY29udHJvbC1iZy1jb2xvdXIiLCJkZXNjIjoiRm9ybSBjb250cm9sIGJhY2tncm91bmQgY29sb3VyIiwiY29sb3VyIjoicmdiKDYwLDEzLDY2KSJ9LHsibmFtZSI6ImJ5b3dhdmUtY3VzdG9tLWNvbnRyb2wtaW5uZXItY29sb3VyIiwiZGVzYyI6IkZvcm0gY29udHJvbCBpbm5lciBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoMTk2LDEzLDI0MikifSx7Im5hbWUiOiJieW93YXZlLWN1c3RvbS1jb250cm9sLXRleHQtY29sb3VyIiwiZGVzYyI6IkZvcm0gY29udHJvbCB0ZXh0IGNvbG91ciIsImNvbG91ciI6InJnYigyMDUsMTQyLDIzOSkifSx7Im5hbWUiOiJieW93YXZlLWltYWdlLWJvcmRlci1jb2xvdXIiLCJkZXNjIjoiSW1hZ2UgYm9yZGVyIGNvbG91ciIsImNvbG91ciI6InJnYigxNjcsMTQsMTk4KSJ9LHsibmFtZSI6ImJ5b3dhdmUtc2Nyb2xsYmFyLWJnLWNvbG91ciIsImRlc2MiOiJTY3JvbGxiYXIgYmFja2dyb3VuZCBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDExLDE1LDMyKSJ9LHsibmFtZSI6ImJ5b3dhdmUtc2Nyb2xsYmFyLWhhbmRsZS1jb2xvdXIiLCJkZXNjIjoiU2Nyb2xsYmFyIGhhbmRsZSBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoMjA3LDE1LDI1NCkifV0=',
    goobender: 'W3sibmFtZSI6ImJ5b3dhdmUtY3RhLWNvbG91ciIsImRlc2MiOiJDYWxsIHRvIGFjdGlvbiBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoNDIsOTgsMjI4KSJ9LHsibmFtZSI6ImJ5b3dhdmUtY3RhLWRhcmstY29sb3VyIiwiZGVzYyI6IkNhbGwgdG8gYWN0aW9uIGRhcmsgY29sb3VyIiwiY29sb3VyIjoicmdiKDMwLDQ2LDExNykifSx7Im5hbWUiOiJieW93YXZlLWN0YS1ob3Zlci1jb2xvdXIiLCJkZXNjIjoiQ2FsbCB0byBhY3Rpb24gaG92ZXIgY29sb3VyIiwiY29sb3VyIjoicmdiKDczLDEyNiwyMjApIn0seyJuYW1lIjoiYnlvd2F2ZS1jdGEtZGlzYWJsZWQtY29sb3VyIiwiZGVzYyI6IkNhbGwgdG8gYWN0aW9uIGRpc2FibGVkIGNvbG91ciIsImNvbG91ciI6InJnYigzMyw0MCw3NCkifSx7Im5hbWUiOiJieW93YXZlLWN0YS10ZXh0LWNvbG91ciIsImRlc2MiOiJDYWxsIHRvIGFjdGlvbiB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMjIwLCAyMjAsIDIyMCkifSx7Im5hbWUiOiJieW93YXZlLWN0YS1kaXNhYmxlZC10ZXh0LWNvbG91ciIsImRlc2MiOiJDYWxsIHRvIGFjdGlvbiBkaXNhYmxlZCB0ZXh0IGNvbG91ciIsImNvbG91ciI6InJnYig3OCw4NCwxMjcpIn0seyJuYW1lIjoiYnlvd2F2ZS1hbGVydC1jb2xvdXIiLCJkZXNjIjoiQWxlcnQgY29sb3VyIiwiY29sb3VyIjoicmdiKDE1LDM4LDIwOSkifSx7Im5hbWUiOiJieW93YXZlLWFsZXJ0LXRleHQtY29sb3VyIiwiZGVzYyI6IkFsZXJ0IHRleHQgY29sb3VyIiwiY29sb3VyIjoicmdiKDE3NiwxOTMsMjQ3KSJ9LHsibmFtZSI6ImJ5b3dhdmUtcGFyYWdyYXBoLXRleHQtY29sb3VyIiwiZGVzYyI6IlBhcmFncmFwaCB0ZXh0IGNvbG91ciIsImNvbG91ciI6InJnYigxNTcsMTg0LDIyNykifSx7Im5hbWUiOiJieW93YXZlLWhlYWRpbmctdGV4dC1jb2xvdXIiLCJkZXNjIjoiSGVhZGluZyB0ZXh0IGNvbG91ciIsImNvbG91ciI6InJnYigxOTIsMTk2LDIzNCkifSx7Im5hbWUiOiJieW93YXZlLXBhbmVsLWJnLWNvbG91ciIsImRlc2MiOiJQYW5lbCBiYWNrZ3JvdW5kIGNvbG91ciIsImNvbG91ciI6InJnYigyOSw0MSw3MSkifSx7Im5hbWUiOiJieW93YXZlLXBhbmVsLWhvdmVyLWJnLWNvbG91ciIsImRlc2MiOiJQYW5lbCBob3ZlciBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoNDIsNDYsMTA2KSJ9LHsibmFtZSI6ImJ5b3dhdmUtcGFuZWwtdGV4dC1jb2xvdXIiLCJkZXNjIjoiUGFuZWwgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoMTcwLDIwMCwyNDIpIn0seyJuYW1lIjoiYnlvd2F2ZS1wYW5lbC10ZXh0LWxpZ2h0LWNvbG91ciIsImRlc2MiOiJQYW5lbCBsaWdodCB0ZXh0IGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTAzLDEwNiwxMzMpIn0seyJuYW1lIjoiYnlvd2F2ZS1pbnB1dGZpZWxkLWJnLWNvbG91ciIsImRlc2MiOiJJbnB1dCBmaWVsZCBiYWNrZ3JvdW5kIGNvbG91ciIsImNvbG91ciI6InJnYigzMCwzNSw2MCkifSx7Im5hbWUiOiJieW93YXZlLWlucHV0ZmllbGQtdGV4dC1jb2xvdXIiLCJkZXNjIjoiSW5wdXQgZmllbGQgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoMzEsMTEyLDIyMikifSx7Im5hbWUiOiJieW93YXZlLWlucHV0ZmllbGQtdGV4dC1kaXNhYmxlZC1jb2xvdXIiLCJkZXNjIjoiSW5wdXQgZmllbGQgZGlzYWJsZWQgdGV4dCBjb2xvdXIiLCJjb2xvdXIiOiIgcmdiKDEyMSwgMTIxLCAxMjEpIn0seyJuYW1lIjoiYnlvd2F2ZS1pbnB1dGZpZWxkLXBsYWNlaG9sZGVyLXRleHQtY29sb3VyIiwiZGVzYyI6IklucHV0IGZpZWxkIHBsYWNlaG9sZGVyIHRleHQgY29sb3VyIiwiY29sb3VyIjoicmdiKDU2LDgyLDEyMykifSx7Im5hbWUiOiJieW93YXZlLWN1c3RvbS1jb250cm9sLWJvcmRlci1jb2xvdXIiLCJkZXNjIjoiRm9ybSBjb250cm9sIGJvcmRlciBjb2xvdXIiLCJjb2xvdXIiOiJyZ2IoMjgsODEsMjIzKSJ9LHsibmFtZSI6ImJ5b3dhdmUtY3VzdG9tLWNvbnRyb2wtYmctY29sb3VyIiwiZGVzYyI6IkZvcm0gY29udHJvbCBiYWNrZ3JvdW5kIGNvbG91ciIsImNvbG91ciI6InJnYigxMywyMCw2NikifSx7Im5hbWUiOiJieW93YXZlLWN1c3RvbS1jb250cm9sLWlubmVyLWNvbG91ciIsImRlc2MiOiJGb3JtIGNvbnRyb2wgaW5uZXIgY29sb3VyIiwiY29sb3VyIjoicmdiKDEyLDgyLDI0MikifSx7Im5hbWUiOiJieW93YXZlLWN1c3RvbS1jb250cm9sLXRleHQtY29sb3VyIiwiZGVzYyI6IkZvcm0gY29udHJvbCB0ZXh0IGNvbG91ciIsImNvbG91ciI6InJnYigxNDcsMTY3LDIxMikifSx7Im5hbWUiOiJieW93YXZlLWltYWdlLWJvcmRlci1jb2xvdXIiLCJkZXNjIjoiSW1hZ2UgYm9yZGVyIGNvbG91ciIsImNvbG91ciI6InJnYigzNyw0NywxOTgpIn0seyJuYW1lIjoiYnlvd2F2ZS1zY3JvbGxiYXItYmctY29sb3VyIiwiZGVzYyI6IlNjcm9sbGJhciBiYWNrZ3JvdW5kIGNvbG91ciIsImNvbG91ciI6IiByZ2IoMTEsMTUsMzIpIn0seyJuYW1lIjoiYnlvd2F2ZS1zY3JvbGxiYXItaGFuZGxlLWNvbG91ciIsImRlc2MiOiJTY3JvbGxiYXIgaGFuZGxlIGNvbG91ciIsImNvbG91ciI6InJnYigzNiwzNiwyMDcpIn1d',
  }

  const colours: AccessibilitySiteColour[] = JSON.parse(atob(_.get(templates, template)))

  if(colours){
    colours.forEach(c => {
      document.documentElement.style.setProperty(`--${c.name}`, c.colour)
    })
  }
}

const getSiteColourTemplateList = () => {
  return [
    {value: 'byowave', label: 'ByoWave Default'},
    {value: 'beetrootBaby', label: 'Beetroot Baby'},
    {value: 'goobender', label: 'Goobender Cool Blue'}
  ]
}

const getSiteColourList = (): AccessibilitySiteColour[] => {
  return [
    {name: 'byowave-cta-colour', desc: 'Call to action colour', colour: ''},
    {name: 'byowave-cta-dark-colour', desc: 'Call to action dark colour', colour: ''},
    {name: 'byowave-cta-hover-colour', desc: 'Call to action hover colour', colour: ''},
    {name: 'byowave-cta-disabled-colour', desc: 'Call to action disabled colour', colour: ''},
    {name: 'byowave-cta-text-colour', desc: 'Call to action text colour', colour: ''},
    {name: 'byowave-cta-disabled-text-colour', desc: 'Call to action disabled text colour', colour: ''} ,
    {name: 'byowave-alert-colour', desc: 'Alert colour', colour: ''},
    {name: 'byowave-alert-text-colour', desc: 'Alert text colour', colour: ''},
    {name: 'byowave-paragraph-text-colour', desc: 'Paragraph text colour', colour: ''},
    {name: 'byowave-heading-text-colour', desc: 'Heading text colour', colour: ''},
    {name: 'byowave-panel-bg-colour', desc: 'Panel background colour', colour: ''},
    {name: 'byowave-panel-hover-bg-colour', desc: 'Panel hover colour', colour: ''},
    {name: 'byowave-panel-text-colour', desc: 'Panel text colour', colour: ''},
    {name: 'byowave-panel-text-light-colour', desc: 'Panel light text colour', colour: ''},
    {name: 'byowave-inputfield-bg-colour', desc: 'Input field background colour', colour: ''},
    {name: 'byowave-inputfield-text-colour', desc: 'Input field text colour', colour: ''},
    {name: 'byowave-inputfield-text-disabled-colour', desc: 'Input field disabled text colour', colour: ''},
    {name: 'byowave-inputfield-placeholder-text-colour', desc: 'Input field placeholder text colour', colour: ''},
    {name: 'byowave-custom-control-border-colour', desc: 'Form control border colour', colour: ''},
    {name: 'byowave-custom-control-bg-colour', desc: 'Form control background colour', colour: ''},
    {name: 'byowave-custom-control-inner-colour', desc: 'Form control inner colour', colour: ''},
    {name: 'byowave-custom-control-text-colour', desc: 'Form control text colour', colour: ''},
    {name: 'byowave-image-border-colour', desc: 'Image border colour', colour: ''},
    {name: 'byowave-scrollbar-bg-colour', desc: 'Scrollbar background colour', colour: ''},
    {name: 'byowave-scrollbar-handle-colour', desc: 'Scrollbar handle colour', colour: ''},
  ]
}

const saveDefaultSiteColours = () => {
  const defaultColours: AccessibilitySiteColour[] = getSiteColourList().map(c => {
    return {
      name: c.name,
      desc: c.desc,
      colour: getComputedStyle(document.documentElement).getPropertyValue(`--${c.name}`)
    }
  })
  updateStoredDefaultColours(defaultColours)
}

const updateStoredAccessibilityColours = (colours?: AccessibilitySiteColour[]) => {
  if(colours)
    window.localStorage.setItem('accessibility.colours', btoa(JSON.stringify(colours)))
  else
    window.localStorage.removeItem('accessibility.colours')
}
  
const getStoredAccessibilityColours = (): AccessibilitySiteColour[] => {
  if(window.localStorage.getItem('accessibility.colours') === null){
    return []
  } else {
    const items = window.localStorage.getItem('accessibility.colours') || ''
    return JSON.parse(atob(items))
  }
}

const applyAccessibilityColours = () => {
  const colours = getStoredAccessibilityColours()
  if(colours){
    colours.forEach(c => {
      document.documentElement.style.setProperty(`--${c.name}`, c.colour)
    })
  }
}

const updateStoredDefaultColours = (colours?: AccessibilitySiteColour[]) => {
  if(colours)
    window.localStorage.setItem('accessibility.default', btoa(JSON.stringify(colours)))
  else
    window.localStorage.removeItem('accessibility.default')
}
  
const getStoredDefaultColours = (): AccessibilitySiteColour[] => {
  if(window.localStorage.getItem('accessibility.default') === null){
    return []
  } else {
    const items = window.localStorage.getItem('accessibility.default') || ''
    return JSON.parse(atob(items))
  }
}

const applyDefaultColours = () => {
  const colours = getStoredDefaultColours()
  if(colours){
    colours.forEach(c => {
      document.documentElement.style.setProperty(`--${c.name}`, c.colour)
    })
  }
}

export {
  applyAccessibilityColours,
  applyDefaultColours,
  getSiteColourTemplateList,
  applySiteColourTemplate,
  getSiteColourList,
  getStoredAccessibilityColours,
  saveDefaultSiteColours,
  updateStoredAccessibilityColours,
  updateStoredDefaultColours,
}