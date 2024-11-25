;; charity-registry

(define-data-var next-charity-id uint u0)

(define-map charities
  uint
  {
    name: (string-ascii 64),
    description: (string-ascii 256),
    wallet: principal,
    total-donations: uint,
    transparency-score: uint
  }
)

(define-public (register-charity (name (string-ascii 64)) (description (string-ascii 256)))
  (let
    (
      (charity-id (var-get next-charity-id))
    )
    (map-set charities charity-id {
      name: name,
      description: description,
      wallet: tx-sender,
      total-donations: u0,
      transparency-score: u100
    })
    (var-set next-charity-id (+ charity-id u1))
    (ok charity-id)
  )
)

(define-read-only (get-charity (charity-id uint))
  (map-get? charities charity-id)
)

(define-public (update-transparency-score (charity-id uint) (new-score uint))
  (let
    (
      (charity (unwrap! (map-get? charities charity-id) (err u404)))
    )
    (asserts! (and (>= new-score u0) (<= new-score u100)) (err u400))
    (map-set charities charity-id (merge charity { transparency-score: new-score }))
    (ok true)
  )
)

