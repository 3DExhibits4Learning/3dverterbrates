'use client'

export default function ModelDataTable() {
    return (
        <>
            <table className="w-full">
                <tr>
                    <th>Species Name</th>
                    <th>UID</th>
                    <th>Modeler</th>
                    <th>Base Model</th>
                    <th>Annotator</th>
                    <th>Annotated</th>
                    <th>Annotation Approval</th>
                    <th>Acquisition Date</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Build Method</th>
                </tr>
            </table>
        </>
    )
}

/*
model model {
  uid                   String        @id @db.VarChar(100)
  spec_name             String        @db.VarChar(100)
  spec_acquis_date      String?       @db.VarChar(20)
  modeled_by            String        @db.VarChar(25)
  site_ready            Boolean       @default(false)
  pref_comm_name        String        @default("") @db.VarChar(100)
  base_model            Boolean       @default(true)
  annotated             Boolean       @default(false)
  annotationsApproved   Boolean       @default(false)
  modelApproved         Boolean       @default(false)
  annotationPosition    String?       @db.VarChar(250)
  build_process         String        @default("Photogrammetry") @db.VarChar(50)
  thumbnail             String?       @db.VarChar(500)
  annotator             String?       @db.VarChar(75)
  annotatorId           String?       @db.VarChar(50) 
  lat                   Decimal?      
  lng                   Decimal?
  email                 String        @db.VarChar(100)
  user                  String        @db.VarChar(100)
  annotations           annotations[]
  software              software[]
  tags                  tags[]
  assignment            assignment?
  model_annotation      model_annotation?
}
*/