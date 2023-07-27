class WithReactNativeOSSNoticeDetailViewController: UIViewController {
    private var licenseContentTextView: UITextView = {
        let textView = UITextView()

        textView.alwaysBounceVertical = true
        textView.dataDetectorTypes = .link
        textView.font = UIFont.systemFont(ofSize: 13.3)
        textView.isEditable = false
        textView.textContainerInset = UIEdgeInsets.init(
            top: 42,
            left: 26,
            bottom: 16,
            right: 26
        )
        textView.translatesAutoresizingMaskIntoConstraints = false
        
        if #available(iOS 13.0, *) {
            textView.backgroundColor = .systemBackground
            textView.textColor = .secondaryLabel
        }

        return textView
    }()

    private var metadata: WithReactNativeOSSNoticeLicenseMetadata
    
    init(metadata: WithReactNativeOSSNoticeLicenseMetadata) {
        self.metadata = metadata
        super.init(nibName: nil, bundle: nil)
        self.title = metadata.name
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.addSubview(licenseContentTextView)
        NSLayoutConstraint.activate([
            licenseContentTextView.heightAnchor.constraint(equalTo: view.heightAnchor),
            licenseContentTextView.widthAnchor.constraint(equalTo: view.widthAnchor)
        ])
        licenseContentTextView.text = metadata.content
    }
}
